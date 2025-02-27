const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../authMiddleware');
const { pool } = require('../server');

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { local, nombre } = req.body;

        const query = `
            UPDATE stock
            SET eliminado = true
            WHERE local = $1
            AND nombre = $2;
        `;

        await pool.query(query, [local, nombre]);

        res.status(200);

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al insertar movimiento en el stock' });
        }
    });

module.exports = router;
