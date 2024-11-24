const express = require('express');
const router = express.Router();
const tournamentController = require('../controllers/tournamentController');
const { verifyToken } = require('../middleware/authMiddleware');

// Create a new tournament
router.post('/tournaments', verifyToken, tournamentController.createTournament);

router.post('/tournaments/:tournamentId/register', verifyToken, tournamentController.registerParticipant);

// Get all tournaments
router.get('/tournaments', verifyToken, tournamentController.getAllTournaments);

// Get a tournament by ID
router.get('/tournaments/:id', verifyToken, tournamentController.getTournamentById);

// Update a tournament
router.patch('/tournaments/:id', verifyToken, tournamentController.updateTournament);

// Delete a tournament
router.delete('/tournaments/:id', verifyToken, tournamentController.deleteTournament);



module.exports = router;
