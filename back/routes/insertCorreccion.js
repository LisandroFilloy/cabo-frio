const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../authMiddleware'); // Import the middleware
const { pool } = require('../server'); // Import pool from server.js

router.post('/', authenticateToken, async (req, res) => {
    try {

        const { local, cantidad } = req.body;

        // Debo traerme aperturaCaja, ingresoVentas, totalEgresos, total

        const query = `
        INSERT INTO correcciones_caja (local, cantidad)
        VALUES ($1, $2)
   `;

        await pool.query(query, [local, cantidad]);

        // Return the values in the response
        res.status(200).json();

    } catch (error) {
        console.error('Error al insertar correccion de caja', error.message);
        res.status(500).json({ error: 'Error al insertar correccion de caja' });
    }
});

module.exports = router;