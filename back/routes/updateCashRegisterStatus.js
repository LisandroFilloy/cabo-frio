const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../authMiddleware'); // Import the middleware
const { pool } = require('../server'); // Import pool from server.js

router.post('/', authenticateToken, async (req, res) => {
    try {
        const query = `INSERT INTO caja (local, monto, usuario, accion) 
        VALUES ($1, $2, $3, $4)`;

        const { local, user, accion } = req.body;

        // Query to calculate monto
        const query_monto = `
            WITH fecha_ultimo_mov_caja AS (
            SELECT fecha_ingreso, monto FROM caja WHERE local = $1 ORDER BY fecha_ingreso DESC LIMIT 1 ),
            monto_efectivo AS (
                SELECT 
                    'efectivo' AS key,
                    SUM(v.total_pesos) AS monto 
                FROM ventas v,fecha_ultimo_mov_caja 
                WHERE local = $1
                AND medio_de_pago = 'efectivo'
                AND v.eliminada = false
                AND v.fecha_creacion >= fecha_ultimo_mov_caja.fecha_ingreso),
            monto_egresos AS (
                SELECT 
                    'egresos' AS key,
                    SUM(e.monto) AS monto
                    FROM egresos e, fecha_ultimo_mov_caja
                    WHERE local = $1
                    AND e.eliminado = false
                    and e.pendiente = false
                    AND e.fecha_egreso >= fecha_ultimo_mov_caja.fecha_ingreso
                    AND e.usuario != 'admin'),
            monto_inicial as (
            SELECT
                'monto_inicial' as key,
                monto
                FROM fecha_ultimo_mov_caja
            ),
            correcciones as (
                SELECT 
                cantidad
                FROM correcciones_caja cc, fecha_ultimo_mov_caja
                WHERE local = $1
                AND cc.fecha_creacion >= fecha_ultimo_mov_caja.fecha_ingreso
            ),
            correccion as (
                select 
                'correccion' as key,
                sum(cantidad) as monto
                from correcciones
            )
            SELECT * FROM monto_efectivo
            UNION
            SELECT * FROM monto_egresos
            UNION 
            SELECT * FROM monto_inicial
            UNION
            SELECT * from correccion
        `;

        const result_monto = await pool.query(query_monto, [local]);
        const data_monto = result_monto.rows;

        let efectivo = 0;
        let egresos = 0;
        let monto_inicial = 0;
        let correccion = 0;

        // Iterate through data_monto to find the correct values
        data_monto.forEach(item => {
            if (item.key === 'efectivo') {
                efectivo = parseFloat(item.monto) || 0;
            } else if (item.key === 'egresos') {
                egresos = parseFloat(item.monto) || 0;
            } else if (item.key === 'monto_inicial') {
                monto_inicial = parseFloat(item.monto) || 0;
            } else if (item.key === 'correccion') {
                correccion = parseFloat(item.monto) || 0;
            }
        });


        // Compute the difference
        const monto = efectivo + monto_inicial - egresos + correccion;

        // Insert into caja
        await pool.query(query, [local, monto, user, accion]);

        res.status(201).json({ message: 'Registro insertado con éxito' });
    } catch (error) {
        console.error('Error al insertar en caja:', error.message);
        res.status(500).json({ error: 'Error al insertar en caja' });
    }
});

module.exports = router;
