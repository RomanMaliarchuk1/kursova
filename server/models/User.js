const db = require('../config/db');

const User = {
    create: (username, email, password, callback) => {
        const sql = 'INSERT INTO Users (username, email, password) VALUES (?, ?, ?)';
        db.query(sql, [username, email, password], callback);
    },

    findByUsername: (username, callback) => {
        const sql = 'SELECT * FROM Users WHERE username = ?';
        db.query(sql, [username], callback);
    },

    findById: (id, callback) => {
        const sql = 'SELECT * FROM Users WHERE id = ?';
        db.query(sql, [id], callback);
    },

    updatePassword: (id, newPassword, callback) => {
        const sql = 'UPDATE Users SET password = ? WHERE id = ?';
        db.query(sql, [newPassword, id], callback);
    }
};

module.exports = User;
