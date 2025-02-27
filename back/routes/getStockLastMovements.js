const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../authMiddleware');
const { pool } = require('../server');

router.post('/', authenticateToken, async (req, res) => {
    try {
        const {local} = req.body;

        const query = `
            SELECT * FROM stock 
            WHERE local = $1
            AND eliminado = false
            AND cantidad != 0
            ORDER BY fecha_creacion DESC
            LIMIT 10
        `;
        
        const result = await pool.query(query, [local]);

        res.status(201).json({ result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener ultimos movimientos del stock' });
    }
});

module.exports = router;
