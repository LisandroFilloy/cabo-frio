const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../authMiddleware'); // Import the middleware

router.get('/', authenticateToken, (req, res) => {
     res.setHeader('Content-Type', 'application/json');
    res.json({
        'username': req.user.username,
        'role': req.user.role
    });
});

module.exports = router;