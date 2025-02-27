const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../authMiddleware');
const { pool } = require('../server');

router.post('/', authenticateToken, async (req, res) => {
    try {
        const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();
        const { local } = req.body;
        const username = req.user.username; // Extract 'username' from JWT payload

        const query = `
            SELECT * FROM ventas 
            WHERE fecha_creacion >= $1 
            AND usuario = $2
            AND local = $3
            ORDER BY fecha_creacion DESC;
        `;
        
        const result = await pool.query(query, [twelveHoursAgo, username, local]);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las ventas desde la base de datos.' });
    }
});

module.exports = router;
