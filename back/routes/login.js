const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { pool } = require('../server'); // Import pool from server.js

const JWT_SECRET = '12345678';
const token_expiration = '12h';

// /api/login route with JWT token generation
router.post('/', async (req, res) => { // Change to '/' since it's used as a sub-route
    const { usuario, clave } = req.body;
    const clave_enviada = clave

    try {
        const query = "SELECT clave, rol FROM usuarios WHERE usuario = $1";
        const result = await pool.query(query, [usuario]);
        const { rows } = result;

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const { clave, rol } = rows[0];

        if (clave === clave_enviada) {
            const token = jwt.sign({ username: usuario, role: rol }, JWT_SECRET, {
                expiresIn: token_expiration // Token expires in 12 hours
            });
            res.json({
                token: token,
                username: usuario,
                role: rol
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }

    } catch (err) {
        console.error('Error during authentication:', err);
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

module.exports = router;
