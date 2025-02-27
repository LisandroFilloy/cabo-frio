const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../authMiddleware');
const { pool } = require('../server');

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { local, nombre, cantidad, tipo, agregar } = req.body;

        const query = `
            INSERT INTO stock (local, nombre, cantidad, tipo, agregar)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id;
        `;

        const result = await pool.query(query, [local, nombre, cantidad, tipo, agregar]);

        const { id } = result.rows[0];

        res.status(201).json({ id });
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al insertar movimiento en el stock' });
    }
});

module.exports = router;
