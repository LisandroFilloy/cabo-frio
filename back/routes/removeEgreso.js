const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../authMiddleware');
const { pool } = require('../server');

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { id } = req.body;

        const query = `
            UPDATE egresos
            SET eliminado = true
            WHERE id = $1
            RETURNING id;
        `;

        const result = await pool.query(query, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Egreso no encontrado.' });
        }

        res.status(200).json({ id: result.rows[0].id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el egreso en la base de datos.' });
    }
});

module.exports = router;
