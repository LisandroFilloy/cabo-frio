const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../authMiddleware');
const { pool } = require('../server');

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { local } = req.body;
        const query = "SELECT fecha_ingreso, accion, monto, usuario FROM caja WHERE local = $1 ORDER BY fecha_ingreso DESC LIMIT 1";
        const response = await pool.query(query, [local]);

        if (response.rows.length > 0) {
            const { fecha_ingreso, accion, _, usuario } = response.rows[0];
            res.json({fecha_ingreso, accion, usuario});
        } else {
            // Todavia no hubo aperturas y cierres de caja
            const fecha_ingreso = new Date(2024,0,1)
            const accion = 'cerrar'
            const usuario = 'admin'
            res.json({fecha_ingreso, accion, usuario});
        }
        
    } catch (error) {
        console.error('Error fetching latest action:', error);
        res.status(500).json({ error: 'An error occurred while fetching the latest action' });
    }
});

module.exports = router;
