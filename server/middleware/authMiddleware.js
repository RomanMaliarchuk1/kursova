const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

    if (!token) {
        console.error('Token is missing');
        return res.status(403).json({ message: 'Token is required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Token verification failed:', err.message);
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = decoded; // Store user info in the request object
        next();
    });
};
