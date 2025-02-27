const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../authMiddleware');
const { pool } = require('../server');

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { id } = req.body;

        const query = `
            UPDATE productos
            SET eliminado = TRUE
            WHERE id = $1
            RETURNING id;
        `;
        
        const result = await pool.query(query, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }

        const { id: removedId } = result.rows[0];
        res.status(200).json({ id: removedId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el producto en la base de datos.' });
    }
});

module.exports = router;
