const express = require('express');
const { startGame, submitGuess } = require('../controllers/gameController');
const authenticate = require('../middleware/auth');
const router = express.Router();

// Authentification
router.post('/start', authenticate, startGame);
router.post('/guess', authenticate, submitGuess);

// router.post('/start', startGame);
// router.post('/guess', submitGuess);
module.exports = router;
