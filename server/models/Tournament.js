const db = require('../config/db');

const Tournament = {
    create: (name, type, start_date, end_date, status, description, creator_id, max_participants, prize_pool, callback) => {
        const sql = `
            INSERT INTO tournaments (name, type, start_date, end_date, status, description, creator_id, max_participants, prize_pool) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        db.query(sql, [name, type, start_date, end_date, status, description, creator_id, max_participants, prize_pool], callback);
    },

    findAll: (callback) => {
        const sql = 'SELECT * FROM tournaments';
        db.query(sql, callback);
    },

    findById: (id, callback) => {
        const sql = 'SELECT * FROM tournaments WHERE id = ?';
        db.query(sql, [id], (error, results) => {
            if (error) return callback(error, null);
            console.log('Tournament query results:', results);
            callback(null, results.length > 0 ? results[0] : null);
        });
    },
    
    update: (id, data, callback) => {
        const updates = [];
        const values = [];
    
        if (data.name) {
            updates.push('name = ?');
            values.push(data.name);
        }
        if (data.type) {
            updates.push('type = ?');
            values.push(data.type);
        }
        if (data.start_date) {
            updates.push('start_date = ?');
            values.push(data.start_date);
        }
        if (data.end_date) {
            updates.push('end_date = ?');
            values.push(data.end_date);
        }
        if (data.status) {
            updates.push('status = ?');
            values.push(data.status);
        }
        if (data.description) {
            updates.push('description = ?');
            values.push(data.description);
        }
        if (data.creator_id) {
            updates.push('creator_id = ?');
            values.push(data.creator_id);
        }
        if (data.max_participants) {
            updates.push('max_participants = ?');
            values.push(data.max_participants);
        }
        if (data.prize_pool) {
            updates.push('prize_pool = ?');
            values.push(data.prize_pool);
        }
    
        if (updates.length === 0) {
            return callback(new Error('No fields to update'));
        }
    
        const sql = `UPDATE tournaments SET ${updates.join(', ')} WHERE id = ?`;
        values.push(id);
    
        // Логування SQL-запиту і значень
        console.log('SQL Query:', sql);
        console.log('Values:', values);
    
        db.query(sql, values, callback);
    },

    delete: (id, callback) => {
        const sql = 'DELETE FROM tournaments WHERE id = ?';
        db.query(sql, [id], callback);
    },

    checkParticipants: (tournamentId, callback) => {
        const sql = `
            SELECT COUNT(*) AS participant_count
            FROM participants
            WHERE tournament_id = ?`;
        db.query(sql, [tournamentId], callback);
    },

    getMaxTeams: (tournamentId, callback) => {
        const sql = `
            SELECT teams
            FROM tournaments
            WHERE id = ?`;
        db.query(sql, [tournamentId], callback);
    }
};

module.exports = Tournament;
