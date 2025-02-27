const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../authMiddleware');
const { pool } = require('../server');

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { id } = req.body;

        const query = `
            UPDATE productos
            SET activo = FALSE
            WHERE id = $1
            RETURNING id;
        `;
        
        const result = await pool.query(query, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }

        const { id: deactivatedId } = result.rows[0];
        res.status(200).json({ id: deactivatedId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al desactivar el producto en la base de datos.' });
    }
});

module.exports = router;
