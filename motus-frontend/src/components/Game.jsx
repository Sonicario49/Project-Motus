import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Game({ token, setToken  }) {
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState([]);
  const [message, setMessage] = useState('');
  const [scores, setScores] = useState([]);
  const [showScores, setShowScores] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/');
  };

  const resetGame = () => {
  setGame(null);
  setGuess('');
  setAttempts([]);
  setMessage('');
  };

  const startGame = async (difficulty) => {
    try {
      const res = await axios.post('http://localhost:5000/api/game/start',
        { difficulty },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setGame(res.data);
      setAttempts([]);
      setMessage('');
    } catch (err) {
      setMessage(err.response?.data?.error || 'startgame à échouer');
    }
  };

  const submitGuess = async () => {
  if (!guess || guess.length !== game.wordLength) {
    setMessage(`Veuiller entrer un mot de longueur ${game.wordLength}`);
    return;
  }

  // debug
  //console.log("game:", game);
  //console.log("game.id:", game?.id);

  try {
    const res = await axios.post('http://localhost:5000/api/game/guess',
    {
      gameId: game.id,
      guess
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
    }
  );

    setAttempts([...attempts, {
      word: guess,
      hints: res.data.hints
    }]);

    setGame({
      ...game,
      attemptsLeft: res.data.attemptsLeft,
      isWin: res.data.isWin,
      isGameOver: res.data.isGameOver
    });

    if (res.data.isWin) setMessage('Gagné !');
    if (res.data.isGameOver && !res.data.isWin) {
      setMessage(`Perdu ! Le mot était: ${res.data.secretWord}`);
    }

    setGuess('');
    } catch (err) {
      console.error("Guess error:", err);
      setMessage(err.response?.data?.error || 'Erreur de validation');
    }
};
  const fetchScores = async () => {
    if (!showScores) {
      try {
        const res = await axios.get('http://localhost:5000/api/scores');
        setScores(res.data); // Stocker les scores dans l'état
      } catch (err) {
        console.error("Guess error:", err);
        console.error("Erreur lors de la récupération des scores :", err);
      }
    }
    setShowScores(!showScores);
  };

  const renderAttempts = () => {
    return attempts.map((attempt, i) => (
      <div key={i} className="attempt">
        {attempt.word.split('').map((letter, j) => (
          <span
            key={j}
            className={`letter ${attempt.hints[j]?.status || ''}`}
          >
            {letter}
          </span>
        ))}
      </div>
    ));
  };

  return (
    <div className="motus-game">
      <div className="header">
        <img src="/motus.png" alt="Logo Motus" className="logo" />
        <button onClick={handleLogout}>Déconnexion</button>
      </div>
      {!game ? (
        <div className="difficulty-select">
          <button onClick={() => startGame('easy')}>Facile</button>
          <button onClick={() => startGame('medium')}>Moyen</button>
          <button onClick={() => startGame('hard')}>Difficile</button>
        </div>
      ) : (
        <>
          <div className="game-info">
          {/* Pour test
            <p>Longueur: {game.wordLength} | Lettre: {game.firstLetter}</p>
          */}
            <p>Essais restants: {game.attemptsLeft}</p>
          </div>

          <div className="attempts">{renderAttempts()}</div>

          {attempts.length === 0 && game && (
              <div className="attempt">
                {Array.from({ length: game.wordLength }).map((_, i) => (
                  <span key={i} className="letter absent">
                    {i === 0 ? game.firstLetter.toUpperCase() : '_'}
                  </span>
                ))}
              </div>
            )}

          <div className="guess-input">
            <input
              value={guess}
              onChange={(e) => {
                const onlyLetters = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
                setGuess(onlyLetters);
              }}
              maxLength={game.wordLength}
            />
            {game.isWin || game.attemptsLeft === 0 ? (
                <button onClick={resetGame}>Retour</button>
              ) : (
                <button onClick={submitGuess}>Essayer</button>
              )}
          </div>
        </>
      )}

      {message && <div className="message">{message}</div>}
      <button id="show-scores" onClick={fetchScores}>
        {showScores ? 'Masquer Wall of Fame' : 'Wall of Fame'}
      </button>

      {showScores && (
          <div className="scores-table">
            <h2>Top 5 Wall of Fame</h2>
            <table>
              <thead>
                <tr>
                  <th>Joueur</th>
                  <th>Mot</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.user?.pseudo || "Inconnu"}</td>
                    <td>{entry.word?.word || "?"}</td>
                    <td>{entry.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
}

export default Game;
