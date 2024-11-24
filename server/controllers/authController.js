const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.register = (req, res) => {
    const { username, email, password } = req.body;

    User.create(username, email, password, (error, results) => {
        if (error) return res.status(500).json({ message: 'Error creating user' });
        res.status(201).json({ message: 'User registered successfully' });
    });
};

exports.login = (req, res) => {
    const { username, password } = req.body;

    User.findByUsername(username, (error, results) => {
        if (error || results.length === 0) return res.status(401).json({ message: 'Invalid username or password' });

        const user = results[0];
        
        if (password !== user.password) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, userId: user.id });
    });
};
