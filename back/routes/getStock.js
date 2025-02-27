const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../authMiddleware');
const { pool } = require('../server');

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { local } = req.body;

        // SQL query to subtract stock_valores quantities from stock quantities
        const query = `
            WITH stock_valores_cte AS (
                SELECT 
                    nombre,
                    cantidad 
                FROM stock_valores
                WHERE local = $1
            ),
            stock_aggregated AS (
                SELECT 
                    nombre,
                    tipo,
                    SUM(CASE WHEN agregar THEN cantidad ELSE -cantidad END) AS cantidad
                FROM stock
                WHERE local = $1
                AND eliminado = FALSE
                GROUP BY nombre, tipo
            )
            SELECT 
                sa.nombre, 
                sa.tipo, 
                COALESCE(sa.cantidad, 0) - COALESCE(sv.cantidad, 0) AS cantidad
            FROM stock_aggregated sa
            LEFT JOIN stock_valores_cte sv
            ON sa.nombre = sv.nombre
            ORDER BY sa.nombre
        `;

        const result = await pool.query(query, [local]);

        // Transform the result into the desired format
        const stockMap = result.rows.reduce((acc, row) => {
            acc[row.nombre] = {
                cantidad: parseFloat(row.cantidad), // Ensure quantity is a number
                tipo: row.tipo
            };
            return acc;
        }, {});

        res.json(stockMap);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener stock' });
    }
});

module.exports = router;
