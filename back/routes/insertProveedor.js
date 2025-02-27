const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../authMiddleware');
const { pool } = require('../server');

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { nombre, telefono, email, rubro } = req.body;

        const query = `
            INSERT INTO proveedores (local, nombre, telefono, email, rubro)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id;
        `;
        
        const result = await pool.query(query, [local, nombre, telefono, email, rubro]);

        const { id } = result.rows[0];

        res.status(201).json({ id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al insertar el proveedor en la base de datos.' });
    }
});

module.exports = router;
