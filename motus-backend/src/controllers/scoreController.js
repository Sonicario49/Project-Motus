const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const getScores = async (req, res) => {
  try {
    const scores = await prisma.wall_of_Fame.findMany({
      include: {
        user: true,
        word: true
      },
      orderBy: {
        score: 'desc', // Trier par score décroissant
      },
      take: 5
    });

    res.json(scores); // Renvoyer les scores
  } catch (error) {
    console.error("ERREUR SCORE:", error);
    res.status(500).json({ error: 'ERREUR GET SCORE' });
  }
};

module.exports = { getScores };
