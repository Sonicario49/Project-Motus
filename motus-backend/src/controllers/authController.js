const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { pseudo, email, password } = req.body;

    if (!pseudo || !email || !password) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    // hash le password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { pseudo, email, password: hashedPassword },
    });

    res.status(201).json({
      user: { id: user.id, pseudo: user.pseudo }
    });

  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email déjà utilisé' });
    }
    console.error("Erreur lors de l'inscription :", error);
    res.status(500).json({ error: 'Erreur serveur, réessayez plus tard' });
  }
};


const login = async (req, res) => {
  try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Veuiller entrer votre mail ET mdp' });
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error('Utilisateur introuvable');

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error('MDP incorrect');

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({
        token,
        user: { id: user.id, pseudo: user.pseudo }
      });
      }
      catch (error) {
      res.status(401).json({ error: 'Identifiants erroné' });
      }
};


module.exports = { register, login };
