const db = require('../config/db');

const Match = {

  getMatchById : async (matchId) => {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM matches WHERE id = ?',
        [matchId],
        (err, rows) => {
          if (err) {
            console.error('Error fetching match by ID:', err);
            reject(err);
          }
          if (rows.length > 0) {
            resolve(rows[0]);
          } else {
            resolve(null);
          }
        }
      );
    });
  },

  getMatchesByTournament : (tournamentId, callback) => {
    const sql = `
      SELECT 
        m.id AS match_id,
        m.tournament_id,
        m.round,
        m.participant1_id,
        m.participant2_id,
        m.winner_id,
        m.match_date,
        m.status,
        u1.name AS participant1_name,
        u1.surname AS participant1_surname,
        u2.name AS participant2_name,
        u2.surname AS participant2_surname
      FROM matches m
      JOIN participants p1 ON m.participant1_id = p1.id
      JOIN participants p2 ON m.participant2_id = p2.id
      LEFT JOIN users u1 ON p1.user_id = u1.id 
      LEFT JOIN users u2 ON p2.user_id = u2.id 
      WHERE m.tournament_id = ?
      ORDER BY m.match_date;
    `;
    
    db.query(sql, [tournamentId], (err, results) => {
      if (err) {
        console.error('Error fetching matches:', err);
        return callback(err);
      }
      
      console.log('Matches fetched:', results);
      callback(null, results);
    });
  },

  checkMatchExists : (tournament_id, participant1_id, participant2_id) => {
    return new Promise((resolve, reject) => {
      const matchPair = [
        Math.min(participant1_id, participant2_id),
        Math.max(participant1_id, participant2_id)
      ];

      const query = `
        SELECT * FROM matches
        WHERE tournament_id = ? 
        AND participant1_id = ? 
        AND participant2_id = ?
      `;

      db.execute(query, [tournament_id, matchPair[0], matchPair[1]], (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows.length > 0);
      });
    });
  },

  addMatches: (matches, callback) => {
    console.log('Matches to insert:', matches);
    const sql = `
      INSERT INTO matches (tournament_id, round, participant1_id, participant2_id, winner_id, match_date)
      VALUES ?
    `;

    const values = matches.map(match => [
      match.tournament_id,
      match.round,
      match.participant1_id,
      match.participant2_id,
      match.winner_id,
      match.match_date,
    ]);

    db.query(sql, [values], (err, result) => {
      if (err) {
        console.error('Error inserting matches:', err);
        return callback(err);
      }
      callback(null, result);
    });
  },

  updateMatchWinner: async (matchId, winnerId) => {
    return new Promise((resolve, reject) => {
      db.query(
        'UPDATE matches SET winner_id = ?, status = ? WHERE id = ?',
        [winnerId, 'completed', matchId],
        (err, result) => {
          if (err) {
            console.error('Error updating match winner and status:', err);
            reject(err);
          }
          resolve(result);
        }
      );
    });
  },

  getAllMatches: async () => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          m.id AS match_id,
          m.tournament_id,
          m.round,
          m.participant1_id,
          m.participant2_id,
          m.winner_id,
          m.match_date,
          m.status,
          u1.name AS participant1_name,
          u1.surname AS participant1_surname,
          u2.name AS participant2_name,
          u2.surname AS participant2_surname
        FROM matches m
        LEFT JOIN participants p1 ON m.participant1_id = p1.id
        LEFT JOIN participants p2 ON m.participant2_id = p2.id
        LEFT JOIN users u1 ON p1.user_id = u1.id 
        LEFT JOIN users u2 ON p2.user_id = u2.id 
        ORDER BY m.match_date;
      `;

      db.query(sql, (err, results) => {
        if (err) {
          console.error('Error fetching all matches:', err);
          reject(err);
        }
        resolve(results);
      });
    });
  }

};

module.exports = Match;