const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../authMiddleware');
const { pool } = require('../server');

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { local } = req.body;

        const query = `
        SELECT * FROM egresos 
        WHERE eliminado = false
        AND pendiente = true
        AND local = $1
        ORDER BY fecha_egreso DESC;
        `;
        
        const result = await pool.query(query, [local]);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los egresos desde la base de datos.' });
    }
});

module.exports = router;