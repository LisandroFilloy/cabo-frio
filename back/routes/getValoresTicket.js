const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../authMiddleware'); // Import the middleware
const { pool } = require('../server'); // Import pool from server.js

router.post('/', authenticateToken, async (req, res) => {
    try {

        const { local } = req.body;

        // Debo traerme aperturaCaja, ingresoVentas, totalEgresos, total

        const query_ticket = `
       WITH fecha_ultimo_mov_caja AS (
       SELECT fecha_ingreso, monto FROM caja WHERE local = $1 ORDER BY fecha_ingreso DESC LIMIT 1 ),
       monto_efectivo AS (
           SELECT 
               'efectivo' AS key,
               SUM(v.total_pesos) AS monto 
           FROM ventas v,fecha_ultimo_mov_caja 
           WHERE local = $1
           AND medio_de_pago = 'efectivo' 
           AND v.fecha_creacion >= fecha_ultimo_mov_caja.fecha_ingreso
           AND v.eliminada = false),
       monto_egresos AS (
           SELECT 
               'egresos' AS key,
               SUM(e.monto) AS monto
               FROM egresos e, fecha_ultimo_mov_caja
               WHERE local = $1
               AND e.fecha_egreso >= fecha_ultimo_mov_caja.fecha_ingreso
               AND e.eliminado = false
               and e.usuario != 'admin'),
       monto_inicial as (
       SELECT
           'monto_inicial' as key,
           monto
           FROM fecha_ultimo_mov_caja
       )
       SELECT * FROM monto_efectivo
       UNION
       SELECT * FROM monto_egresos
       UNION 
       SELECT * FROM monto_inicial;
   `;

        const { rows } = await pool.query(query_ticket, [local]);
        // Extract values from the rows
        let aperturaCaja = 0;
        let ingresoVentas = 0;
        let totalEgresos = 0;

        rows.forEach(row => {
            if (row.key === 'monto_inicial') aperturaCaja = Number(row.monto) || 0;
            if (row.key === 'efectivo') ingresoVentas = Number(row.monto) || 0;
            if (row.key === 'egresos') totalEgresos = Number(row.monto) || 0;
        });

        // Calculate total
        const total = aperturaCaja + ingresoVentas - totalEgresos;

        // Return the values in the response
        res.status(200).json({
            aperturaCaja,       // monto_inicial
            ingresoVentas,      // efectivo
            totalEgresos,       // egresos
            total               // calculated total
        });

    } catch (error) {
        console.error('Error al obtener los datos de la caja:', error.message);
        res.status(500).json({ error: 'Error al obtener los datos de la caja' });
    }
});

module.exports = router;