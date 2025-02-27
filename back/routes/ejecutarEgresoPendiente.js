const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../authMiddleware');
const { pool } = require('../server');

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { local, monto, rubro, descripcion, id } = req.body;
        const usuario = req.user.username; // Extract 'username' from JWT payload

        // Primero insertamos el egreso ejecutado
        const insert_query = `
            INSERT INTO egresos (local, monto, rubro, descripcion, usuario)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id;
        `;
        
        await pool.query(insert_query, [local, monto, rubro, descripcion, usuario]);

        // Luego eliminamos el egreso pendiente

        const remove_query = `
        UPDATE egresos
        SET eliminado = true
        WHERE id = $1`

        await pool.query(remove_query, [id])

        res.status(201)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar el egreso en la base de datos.' });
    }
});

module.exports = router;
