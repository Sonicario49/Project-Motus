const express = require('express');
const { generateAndStoreWord  } = require('../controllers/wordController');
const router = express.Router();

router.get('/word', async (req, res) => {
  const { difficulty } = req.query;

  try {
      const word = await generateAndStoreWord(difficulty);
      res.json({
        word: word.word,
        length: word.length,
        difficulty
      });
    } catch (error) {
    res.status(500).json({ error: error.message });
  };
    }
  );

module.exports = router;
