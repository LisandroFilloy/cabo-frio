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
                p.producto_key AS producto,
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
            WHERE v.eliminada = false
        ),
        final_table AS (
            SELECT * FROM ventas_exploded
            WHERE local = $1
        `;


        let counter = 2;
        const string_params = [local];

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

        query += ` AND fecha_creacion >= $${counter}`;
        string_params.push(fecha_inicio);
        counter++;

        query += ` AND fecha_creacion <= $${counter}`;
        string_params.push(fechaFin);

        query += ` 
        ),
        total_pesos AS 
        (SELECT 'total_pesos' AS key, SUM(cantidad * precio_pesos::numeric)::text AS value, 1 AS count FROM final_table),
        medio_de_pago_mas_usado AS 
        (SELECT 'medio_de_pago_mas_usado' AS key, medio_de_pago AS value, COUNT(*) AS count FROM final_table GROUP BY medio_de_pago ORDER BY count DESC LIMIT 1),
        tipo_venta_mas_usado AS 
        (SELECT 'tipo_venta_mas_usado' AS key, tipo_venta AS value, COUNT(*) AS count FROM final_table GROUP BY tipo_venta ORDER BY count DESC LIMIT 1),
        producto_mas_vendido AS 
        (SELECT 'producto_mas_vendido' AS key, producto AS value, SUM(cantidad) AS count FROM final_table GROUP BY producto ORDER BY count DESC LIMIT 1),
        promedio_precio_ventas AS 
        (SELECT 'promedio_precio_ventas' AS key, ROUND(AVG(total_pesos), 2)::text AS value, 1 AS count FROM final_table),
        kilos_vendidos AS 
        (SELECT 'kilos_vendidos' AS key, ROUND(SUM(peso_gramos) / 1000.0, 2)::text AS value, 1 AS count FROM final_table)
        
        SELECT key, value FROM total_pesos 
        UNION 
        SELECT key, value FROM medio_de_pago_mas_usado 
        UNION 
        SELECT key, value FROM tipo_venta_mas_usado 
        UNION 
        SELECT key, value FROM producto_mas_vendido 
        UNION 
        SELECT key, value FROM promedio_precio_ventas 
        UNION 
        SELECT key, value FROM kilos_vendidos`;

        const result = await pool.query(query, string_params);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las ventas desde la base de datos.' });
    }
});

module.exports = router;
