const jwt = require('jsonwebtoken');
const JWT_SECRET = '12345678'; // Ensure this matches the secret used in server.js
DEV_MODE = false

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from Bearer scheme

    if (!token && !DEV_MODE) {
        return res.sendStatus(401); // If no token, return Unauthorized
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err && !DEV_MODE) {
            return res.sendStatus(403); // If token is invalid, return Forbidden
        }
        req.user = user; // Attach the user to the request object
        next();
    });
}

module.exports = { authenticateToken };
