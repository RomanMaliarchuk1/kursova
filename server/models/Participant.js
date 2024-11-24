const db = require('../config/db');

const Participant = {
    create: (tournament_id, user_id, callback) => {
        const sql = `INSERT INTO participants (tournament_id, user_id) VALUES (?, ?)`;
        db.query(sql, [tournament_id, user_id], callback);
    },

    findByUserAndTournament: (user_id, tournament_id, callback) => {
        const sql = `SELECT * FROM participants WHERE user_id = ? AND tournament_id = ?`;
        db.query(sql, [user_id, tournament_id], (error, results) => {
            if (error) return callback(error, null);
            callback(null, results.length > 0 ? results[0] : null);
        });
    },

    countByTournamentId: (tournament_id, callback) => {
        const sql = `SELECT COUNT(*) AS count FROM participants WHERE tournament_id = ?`;
        db.query(sql, [tournament_id], (err, results) => {
            if (err) return callback(err);
            callback(null, results[0].count);
        });
    },

    findAll: (tournament_id, callback) => {
        const sql = `SELECT * FROM participants WHERE tournament_id = ?`;
        db.query(sql, [tournament_id], callback);
    },

    getParticipantsByTournamentId: (tournamentId) => {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT participants.id, 
                       participants.user_id, 
                       users.username, 
                       users.name, 
                       users.surname 
                FROM participants
                JOIN users ON participants.user_id = users.id
                WHERE participants.tournament_id = ?;
            `;
            db.query(sql, [tournamentId], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    }
};

module.exports = Participant;

