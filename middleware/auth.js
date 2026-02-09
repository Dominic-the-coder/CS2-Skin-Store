const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate requests
const authenticate = async (req, res, next) => {
    // Get token from Authorization header and remove "Bearer " prefix
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        // If no token, block access
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // Decode and verify token using secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user by ID from database
        const user = await User.findByPk(decoded.id);

        // If user not found, block access
        if (!user) return res.status(401).json({ message: 'Invalid token' });

        // Attach user to request object for downstream routes
        req.user = user;

        // Allow request to continue
        next();
    } catch (err) {
        // If token invalid or expired, block access
        return res.status(401).json({ message: 'Unauthorized', error: err.message });
    }
};

module.exports = authenticate;
