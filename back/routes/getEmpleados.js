const express = require('express');
const router = express.Router();
const { pool } = require('../server'); // Adjust the path as necessary

router.post('/', async (req, res) => {
    try {
        const { local } = req.body;

        const query = `
            SELECT * FROM empleados 
            WHERE (local = $1 OR local = 'all')
            AND eliminado = FALSE
            ORDER BY fecha_creacion DESC;
        `;

        const result = await pool.query(query, [local]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los empleados desde la base de datos.' });
    }
});

module.exports = router;
