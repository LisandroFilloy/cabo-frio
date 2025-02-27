const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../authMiddleware');
const { pool } = require('../server');

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { usuario } = req.body;

        const query = `
            SELECT local
            from usuarios
            WHERE usuario = $1
            AND eliminado = false
        `;

        const result = await pool.query(query, [usuario]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al buscar usuario.' });
    }
});

module.exports = router;
