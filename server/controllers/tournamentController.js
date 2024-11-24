const Tournament = require('../models/Tournament');
const Participant = require('../models/Participant');

const createTournament = (req, res) => {
    const { name, type, start_date, end_date, status, description, max_participants, prize_pool} = req.body;
    const creator_id = req.user.id;

    Tournament.create(name, type, start_date, end_date, status, description, creator_id, max_participants, prize_pool, (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Error creating tournament', error });
        }
        res.status(201).json({ message: 'Tournament created successfully', tournamentId: results.insertId });
    });
};

const getAllTournaments = (req, res) => {
    Tournament.findAll((error, results) => {
        if (error) return res.status(500).json({ message: 'Error fetching tournaments', error });
        res.status(200).json(results);
    });
};

const getTournamentById = (req, res) => {
    const { id } = req.params;

    Tournament.findById(id, (error, result) => {
        if (error) return res.status(500).json({ message: 'Error fetching tournament', error });
        if (!result) return res.status(404).json({ message: 'Tournament not found' });
        res.status(200).json(result);
    });
};

const updateTournament = (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const userId = req.user.id;

    console.log("Received data:", data); 

    Tournament.findById(id, (error, tournament) => {
        if (error) return res.status(500).json({ message: 'Error fetching tournament', error });
        if (!tournament) return res.status(404).json({ message: 'Tournament not found' });

        if (tournament.creator_id !== userId) {
            return res.status(403).json({ message: 'You do not have permission to edit this tournament' });
        }

        Tournament.update(id, data, (error) => {
            if (error) return res.status(500).json({ message: 'Error updating tournament', error });
            res.status(200).json({ message: 'Tournament updated successfully' });
        });
    });
};

const deleteTournament = (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    Tournament.findById(id, (error, tournament) => {
        if (error) return res.status(500).json({ message: 'Error fetching tournament', error });
        if (!tournament) return res.status(404).json({ message: 'Tournament not found' });

        if (tournament.creator_id !== userId) {
            return res.status(403).json({ message: 'You do not have permission to delete this tournament' });
        }

        Tournament.delete(id, (error) => {
            if (error) return res.status(500).json({ message: 'Error deleting tournament', error });
            res.status(200).json({ message: 'Tournament deleted successfully' });
        });
    });
};

const registerParticipant = (req, res) => {
    const { tournamentId } = req.params;
    const user_id = req.user.id;

    Participant.findByUserAndTournament(user_id, tournamentId, (error, participant) => {
        if (error) {
            return res.status(500).json({ message: 'Error checking participant', error });
        }

        if (participant) {
            return res.status(400).json({ message: 'User is already registered for this tournament' });
        }

        Participant.countByTournamentId(tournamentId, (error, count) => {
            if (error) {
                return res.status(500).json({ message: 'Error fetching participants count', error });
            }

            Tournament.findById(tournamentId, (error, tournament) => {
                if (error) {
                    return res.status(500).json({ message: 'Error fetching tournament', error });
                }
                if (!tournament) {
                    return res.status(404).json({ message: 'Tournament not found' });
                }

                if (count >= tournament.max_participants) {
                    return res.status(400).json({ message: 'Registration limit reached for this tournament' });
                }

                Participant.create(tournamentId, user_id, (error) => {
                    if (error) {
                        return res.status(500).json({ message: 'Error registering participant', error });
                    }
                    res.status(201).json({ message: 'Participant registered successfully' });
                });
            });
        });
    });
};

module.exports = {
    createTournament,
    getAllTournaments,
    getTournamentById,
    updateTournament,
    deleteTournament,
    registerParticipant,
};
