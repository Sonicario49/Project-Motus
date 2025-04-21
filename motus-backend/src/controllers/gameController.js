const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { generateAndStoreWord } = require('./wordController');

const startGame = async (req, res) => {
  const { difficulty } = req.body;
  //const userId = 1;
  const userId = req.user.id;

  try {
    const word = await generateAndStoreWord(difficulty);

    const game = await prisma.game.create({
      data: {
        secretWord: word.word,
        difficulty,
        attempts: 6,
        guesses: "",
        status: 'ongoing',
        userId : userId,
        wordId: word.id
        }
    });

    res.json({
      id: game.id,
      wordLength: word.word.length,
      firstLetter: word.word[0],
      attemptsLeft: game.attempts
    });

  } catch (error) {
    console.error('Erreur startgame:', error);
    res.status(500).json({ error: 'Startgame Erreur' });
  }
};

const submitGuess = async (req, res) => {
  //console.log("Requête reçue pour /guess :", req.body);
  const { gameId, guess } = req.body;

  try {
    const game = await prisma.game.findUnique({ where: { id: gameId } });

    const secretLower = game.secretWord.toLowerCase();

    const guessLower = guess.toLowerCase();

    const hints = secretLower.split('').map((letter, i) => ({
      letter: guess[i],
      status: 'absent'
    }));

    // Créer un tableau pour compter les occurrences des lettres dans le mot secret
    let secretCount = {};
    secretLower.split('').forEach(letter => {
    secretCount[letter] = (secretCount[letter] || 0) + 1;
    });

    // Première passe pour les lettres correctes
    for (let i = 0; i < secretLower.length; i++) {
      if (guessLower[i] === secretLower[i]) {
        hints[i].status = 'correct';
        secretCount[guessLower[i]]--;
      }
    }

    // Deuxième passe pour les lettres mal placées
    for (let i = 0; i < secretLower.length; i++) {
      if (hints[i].status === 'correct') continue;
      if (secretLower.includes(guessLower[i]) && secretCount[guessLower[i]] > 0) {
        hints[i].status = 'misplaced';
        secretCount[guessLower[i]]--;
      }
    }

    const currentGuesses = JSON.parse(game.guesses || '[]');
    const updatedGuesses = [...currentGuesses, guess];

    const isWin = guessLower === secretLower;
    const attemptsLeft = Math.max(0, game.attempts - 1);

    await prisma.game.update({
      where: { id: gameId },
      data: {
        guesses: JSON.stringify(updatedGuesses),
        attempts: attemptsLeft,
        status: isWin ? 'won' : attemptsLeft === 0 ? 'lost' : 'ongoing'
      }
    });

    if (isWin) {
      let baseScore = 0;
      if (game.difficulty === 'easy') baseScore = 50;
      else if (game.difficulty === 'medium') baseScore = 100;
      else if (game.difficulty === 'hard') baseScore = 150;

      const finalScore = baseScore + (attemptsLeft * 20);

      await prisma.wall_of_Fame.create({
        data: {
          userId: game.userId,
          wordId: game.wordId,
          score: finalScore,
        }
      });
    }

    res.json({
      hints,
      attemptsLeft,
      isWin,
      isGameOver: isWin || attemptsLeft === 0,
      secretWord: (isWin || attemptsLeft === 0) ? game.secretWord : undefined
    });

  } catch (error) {
    console.error('Guess error:', error);
    res.status(500).json({ error: 'Invalid guess' });
  }
};
module.exports = { startGame, submitGuess };
