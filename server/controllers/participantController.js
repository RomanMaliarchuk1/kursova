const Participant = require('../models/Participant');
const User = require('../models/user');

const getParticipantCount = (req, res) => {
    const { tournamentId } = req.params;

    Participant.countByTournamentId(tournamentId, (error, count) => {
        if (error) {
            return res.status(500).json({ message: 'Error fetching participant count', error });
        }
        res.status(200).json({ count });
    });
};

const getParticipantsByTournament = async (req, res) => {
    const { tournamentId } = req.params;

    try {
        const results = await Participant.getParticipantsByTournamentId(tournamentId);

        const participantsData = results.map(participant => ({
            user_id: participant.user_id,
            username: participant.username,
            name: participant.name,
            surname: participant.surname,
        }));

        res.status(200).json(participantsData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching participants', error });
    }
};

module.exports = {
    getParticipantCount,
    getParticipantsByTournament,
};
