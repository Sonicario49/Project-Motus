import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Game from './components/Game';

function App() {
  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem('token');
    return stored && stored !== 'undefined' && stored !== 'null' && stored !== '' ? stored : null;
  });

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={token ? <Navigate to="/game" /> : <Auth setToken={setToken} />}
        />
        <Route
          path="/game"
          element={token ? <Game token={token} setToken={setToken} /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
