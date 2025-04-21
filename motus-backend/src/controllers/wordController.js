const { fetchFrenchWord } = require('../utils/wordGenerator');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const generateAndStoreWord = async (difficulty) => {
  try {
    const word = await fetchFrenchWord(difficulty);

    const storedWord = await prisma.word.upsert({
      where: { word },
      create: {
        word,
        difficulty,
        length: word.length
      },
      update: {},
    });
    const allWords = await prisma.word.findMany({
      where: { difficulty },
    });
    const randomWord = allWords[Math.floor(Math.random() * allWords.length)];

    return randomWord;
  } catch (error) {
    console.error('erreur a la generation du mot :', error);
  }
};

module.exports = { generateAndStoreWord };
