const express = require('express');
const router = express.Router();
const { pool } = require('../server'); // Adjust the path as necessary

router.post('/', async (req, res) => {
    try {
        const { local, nombre, apellido, numero_de_doc, telefono } = req.body;

        const query = `
            INSERT INTO empleados (local, nombre, apellido, numero_de_doc, telefono)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id;
        `;
        
        const result = await pool.query(query, [local, nombre, apellido, numero_de_doc, telefono]);

        const { id } = result.rows[0];
        res.status(201).json({ id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar el empleado en la base de datos.' });
    }
});

module.exports = router;
