const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const { verifyToken } = require('../middleware/authMiddleware'); // якщо потрібна авторизація

router.get('/matches', verifyToken, matchController.getAllMatches);

router.post('/matches/generate/:tournament_id', verifyToken, matchController.generateMatches);

router.get('/matches/:tournament_id', verifyToken, matchController.getMatchesByTournamentId);

router.post('/matches/:matchId/select-winner', verifyToken, matchController.selectWinner);

module.exports = router;
