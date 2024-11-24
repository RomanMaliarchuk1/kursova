const express = require('express');
const router = express.Router();
const participantController = require('../controllers/participantController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/participants/count/:tournamentId', verifyToken, participantController.getParticipantCount);
router.get('/participants/:tournamentId', verifyToken, participantController.getParticipantsByTournament);

module.exports = router;
