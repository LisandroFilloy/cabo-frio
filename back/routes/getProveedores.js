const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../authMiddleware');
const { pool } = require('../server');

router.post('/', authenticateToken, async (req, res) => {
    try {

        let query = `SELECT * FROM proveedores 
                    WHERE eliminado=false
                    ORDER BY fecha_creacion DESC`;

        const result = await pool.query(query);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los proveedores desde la base de datos.' });
    }
});

module.exports = router;
