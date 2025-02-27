const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../authMiddleware');
const { pool } = require('../server');

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'Faltan parámetros.' });
        }

        const query = `
            UPDATE proveedores
            SET eliminado = TRUE
            WHERE id = $1
            RETURNING id;
        `;

        const result = await pool.query(query, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Proveedor no encontrado.' });
        }

        const { id: removedId } = result.rows[0];
        res.status(200).json({ id: removedId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el proveedor en la base de datos.' });
    }
});

module.exports = router;
