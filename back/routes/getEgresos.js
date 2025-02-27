const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../authMiddleware');
const { pool } = require('../server');

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { local, user } = req.body;

        // Calcula la fecha actual menos 12 horas
        const currentDate = new Date();
        const dateMinus12Hours = new Date(currentDate.getTime() - 12 * 60 * 60 * 1000);

        const query = `
            SELECT *
            FROM egresos
            WHERE local = $1 
            AND fecha_egreso > $2
            AND eliminado = false
            AND pendiente = false
            AND usuario = $3
            ORDER BY fecha_egreso DESC;
        `;
        
        const result = await pool.query(query, [local, dateMinus12Hours, user]);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los egresos desde la base de datos.' });
    }
});

module.exports = router;
