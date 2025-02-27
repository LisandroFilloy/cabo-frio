const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../authMiddleware');
const { pool } = require('../server'); // Adjust the path as necessary

router.post('/', authenticateToken, async (req, res) => {
    try {
        var { local, usuario, clave, rol, nombre, apellido, telefono, documento } = req.body;

        if(rol === 'admin'){
            local = 'todos'
        };

        const query = `
            INSERT INTO usuarios (local, usuario, clave, rol, nombre, apellido, telefono, documento)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id;
        `;

        const result = await pool.query(query, [local, usuario, clave, rol, nombre, apellido, telefono, documento]);
        const { id } = result.rows[0];

        res.status(201).json({ id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el usuario en la base de datos.' });
    }
});

module.exports = router;
