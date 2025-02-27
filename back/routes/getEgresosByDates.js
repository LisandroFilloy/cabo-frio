const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../authMiddleware');
const { pool } = require('../server'); // Adjust the path as necessary

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { local, fecha_inicio, fecha_fin } = req.body;

        let fechaFin = fecha_fin;
        if (fecha_fin) {
            const [year, month, day] = fecha_fin.split('-').map(Number); // Dividir y convertir a números
            const date = new Date(year, month - 1, day); // Crear el objeto Date (meses van de 0 a 11)
            date.setDate(date.getDate() + 1); // Agregar un día
        
            // Formatear la nueva fecha como yyyy-mm-dd
            const nextYear = date.getFullYear();
            const nextMonth = String(date.getMonth() + 1).padStart(2, '0'); // Mes con dos dígitos
            const nextDay = String(date.getDate()).padStart(2, '0'); // Día con dos dígitos
            fechaFin = `${nextYear}-${nextMonth}-${nextDay}`;
        }

        const query = `
            SELECT * FROM egresos
            WHERE local = $1
            AND fecha_egreso >= $2
            AND fecha_egreso <= $3
            AND eliminado = false
        `;

        const result = await pool.query(query, [local, fecha_inicio, fechaFin]);

        const results = result.rows;
        res.status(201).json({ results });
    } catch (error) {
        console.error('Error in egreso query:', error.message);
        res.status(500).json({ error: 'Error al buscar egresos' });
    }
});

module.exports = router;
