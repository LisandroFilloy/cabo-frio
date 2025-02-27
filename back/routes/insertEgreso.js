const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../authMiddleware');
const { pool } = require('../server');

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { local, monto, rubro, descripcion, pendiente } = req.body;
        const usuario = req.user.username; // Extract 'username' from JWT payload

        const query = `
            INSERT INTO egresos (local, monto, rubro, descripcion, usuario, pendiente)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id;
        `;
        
        const result = await pool.query(query, [local, monto, rubro, descripcion, usuario, pendiente]);

        const { id } = result.rows[0];

        res.status(201).json({ id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar el egreso en la base de datos.' });
    }
});

module.exports = router;
