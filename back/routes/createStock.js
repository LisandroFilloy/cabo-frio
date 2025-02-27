
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../authMiddleware');
const { pool } = require('../server');

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { local, nombre } = req.body;

        const query = `
                INSERT INTO stock_valores (local, nombre, cantidad)
                VALUES ($1, $2, 0);
        `;

        await pool.query(query, [local, nombre]);

        res.status(200);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear nuevo valor en el stock de valores' });
    }
});

module.exports = router;


