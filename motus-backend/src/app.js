const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/authRoutes');
const wordRoutes = require('./routes/wordRoutes');
const gameRoutes = require('./routes/gameRoutes');
const scoreRoutes = require('./routes/scoreRoutes');

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api', wordRoutes);
app.use('/api', scoreRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Motus backend en route !');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
