const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../authMiddleware');
const { pool } = require('../server'); // Adjust the path as necessary

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { local, fecha_inicio, fecha_fin } = req.body;

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
        
        const query = `
        WITH selected_sales AS (
            SELECT * FROM ventas
            WHERE local = $1
            AND fecha_creacion >= $2
            AND fecha_creacion <= $3
            AND eliminada = false
            ORDER BY fecha_creacion DESC
        ),
        data_sales AS (
            SELECT count(*) AS total_ventas, sum(total_pesos) AS total_pesos_bruto, sum(total_usd) AS total_usd_bruto
            FROM selected_sales
        ),
        data_exploded AS (
            SELECT
                p_data.peso_gramos,
                p_data.cantidad,
                p_data.costo_usd,
                p_data.costo_pesos
            FROM selected_sales v,
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
        ),
        exploded_analytics AS (
            SELECT
                SUM(peso_gramos) AS total_gramos,
                SUM(costo_pesos) AS total_costo_pesos,
                SUM(costo_usd) AS total_costo_usd
            FROM data_exploded
        )
        SELECT
            ds.total_ventas,
            ea.total_costo_pesos,
            ea.total_costo_usd,
            ds.total_pesos_bruto - ea.total_costo_pesos AS total_ganancia_pesos,
            ds.total_usd_bruto - ea.total_costo_usd AS total_ganancia_usd,
            ea.total_gramos
        FROM data_sales ds, exploded_analytics ea;
        `;

        const result = await pool.query(query, [local, fecha_inicio, fechaFin]);

        const results = result.rows[0]; // Assuming there's only one row
        res.status(201).json({ results });
    } catch (error) {
        console.error('Error in balance query:', error.message);
        res.status(500).json({ error: 'Error al armar balance' });
    }
});

module.exports = router;
