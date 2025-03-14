const express = require('express');
const router = express.Router();
const { pool } = require('../server'); // Adjust the path as necessary

router.post('/', async (req, res) => {
    try {
        const { id } = req.body;

        const query = `
            UPDATE usuarios
            SET activo = TRUE
            WHERE id = $1;
        `;

        await pool.query(query, [id]);

        res.status(200).json({ message: 'Usuario activado correctamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al activar el usuario en la base de datos.' });
    }
});

module.exports = router;
