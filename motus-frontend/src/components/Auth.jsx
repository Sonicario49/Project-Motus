import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Auth({ setToken }) {
  const [email, setEmail] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const res = await axios.post(`http://localhost:5000${endpoint}`, {
        email,
        password,
        ...(isLogin ? {} : { pseudo })
      });

      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      navigate('/game');

    } catch (err) {
      console.error("Erreur d'authentification :", err);
      setError(err.response?.data?.error || 'Erreur auth');
      }
  };

  return (
    <div className="auth-container">
      <img src="/motus.png" alt="Logo Motus" className="logo" />

      <h2>{isLogin ? 'Connexion' : 'Inscription'}</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          required
        />
        {!isLogin && (
        <input
          type="text"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
          placeholder="Pseudo"
          required
        />
        )}
        <button type="submit">
          {isLogin ? 'Se connecter' : 'Créer un compte'}
        </button>
      </form>
      <button
        onClick={() => setIsLogin(!isLogin)}
        className="switch-mode"
      >
        {isLogin ? 'Créer un compte' : 'Déjà un compte ? Se connecter'}
      </button>
    </div>
  );
}

export default Auth;
