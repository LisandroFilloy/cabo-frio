const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../authMiddleware');
const { pool } = require('../server');

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { local, rubro, producto, tipo_venta, medio_de_pago, fecha_inicio, fecha_fin } = req.body;

        let fechaFin = fecha_fin;
        if (fecha_fin) {
            const [year, month, day] = fecha_fin.split('-').map(Number); // Dividir y convertir a números
            const date = new Date(year, month - 1, day); // Crear el objeto Date (meses van de 0 a 11)
            date.setDate(date.getDate() + 1); // Agregar un día
        
            // Formatear la nueva fecha como yyyy-mm-dd
            const nextYear = date.getFullYear();
            const nextMonth = String(date.getMonth() + 1).padStart(2, '0'); // Mes con dos dígitos
            const nextDay = String(date.getDate()).padStart(2, '0'); // Día con dos dígitos
            fechaFin = `${nextYear}-${nextMonth}-${nextDay}`;
        }


        let query = `WITH ventas_exploded AS (
            SELECT
                v.id AS venta_id,
                v.fecha_creacion,
                v.local,
                v.total_pesos,
                v.total_usd,
                v.nombre,
                v.direccion,
                v.medio_de_pago,
                v.tipo_venta,
                v.usuario,
                v.eliminada,
                p.producto_key as producto,
                p_data.rubro,
                p_data.cantidad,
                p_data.costo_usd,
                p_data.precio_usd,
                p_data.costo_pesos,
                p_data.peso_gramos,
                p_data.precio_pesos
            FROM
                ventas v,
                jsonb_each(v.productos) AS p(producto_key, producto_value),
                jsonb_to_record(p.producto_value::jsonb) AS p_data(
                    rubro TEXT,
                    cantidad INTEGER,
                    costo_usd NUMERIC,
                    precio_usd NUMERIC,
                    costo_pesos NUMERIC,
                    peso_gramos INTEGER,
                    precio_pesos NUMERIC
                )
            WHERE eliminada = false
        )
        SELECT * FROM ventas_exploded
        WHERE local = $1
        `;

        const string_params = [local];
        let counter = 2;

        // Conditional filters
        if (rubro && rubro !== 'todos') {
            query += ` AND rubro = $${counter}`;
            string_params.push(rubro);
            counter++;
        }

        if (producto && producto !== 'todos') {
            query += ` AND producto = $${counter}`;
            string_params.push(producto);
            counter++;
        }

        if (tipo_venta && tipo_venta !== 'todos') {
            query += ` AND tipo_venta = $${counter}`;
            string_params.push(tipo_venta);
            counter++;
        }

        if (medio_de_pago && medio_de_pago !== 'todos') {
            query += ` AND medio_de_pago = $${counter}`;
            string_params.push(medio_de_pago);
            counter++;
        }

        // Add the date filters
        if (fecha_inicio) {
            query += ` AND fecha_creacion >= $${counter}`;
            string_params.push(fecha_inicio);
            counter++;
        }

        if (fechaFin) {
            query += ` AND fecha_creacion < $${counter}`; // Cambiar <= por < para que incluya hasta el día anterior
            string_params.push(fechaFin);
        }

        query += ` ORDER BY fecha_creacion DESC`;

        // Execute the query
        const result = await pool.query(query, string_params);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las ventas desde la base de datos.' });
    }
});

module.exports = router;
