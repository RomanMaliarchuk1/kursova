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

    findById: (id, callback) => {
        const sql = 'SELECT * FROM Users WHERE id = ?';
        db.query(sql, [id], (error, results) => {
            if (error) return callback(error);
            if (results.length === 0) return callback(null, null);
            callback(null, results[0]);
        });
    },

    update: (id, data, callback) => {
        const updates = [];
        const values = [];

        if (data.name) {
            updates.push('name = ?');
            values.push(data.name);
        }
        if (data.surname) {
            updates.push('surname = ?');
            values.push(data.surname);
        }
        if (data.email) {
            updates.push('email = ?');
            values.push(data.email);
        }
        if (data.city) {
            updates.push('city = ?');
            values.push(data.city);
        }
        if (data.country) {
            updates.push('country = ?');
            values.push(data.country);
        }

        if (updates.length === 0) {
            return callback(new Error('No fields to update'));
        }

        const sql = `UPDATE Users SET ${updates.join(', ')} WHERE id = ?`;
        values.push(id)

        db.query(sql, values, callback);
    },

    updatePassword: (id, newPassword, callback) => {
        const sql = 'UPDATE Users SET password = ? WHERE id = ?';
        db.query(sql, [newPassword, id], (error, results) => {
            if (error) return callback(error);
            if (results.affectedRows === 0) {
                return callback(new Error('User not found or password unchanged.'));
            }
            callback(null, results);
        });
    },
};

module.exports = User;
