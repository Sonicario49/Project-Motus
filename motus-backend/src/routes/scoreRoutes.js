const express = require('express');
const router = express.Router();
const { getScores } = require('../controllers/scoreController');

router.get('/scores', getScores);

module.exports = router;
