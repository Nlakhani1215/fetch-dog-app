import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from '@pages/LoginPage';
import SearchPage from '@pages/SearchPage';
import FavoritesPage from '@pages/FavoritesPage';
import MatchPage from '@pages/MatchPage';
import PrivateRoute from '@components/PrivateRoute';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/search" element={<PrivateRoute><SearchPage /></PrivateRoute>} />
        <Route path="/favorites" element={<PrivateRoute><FavoritesPage /></PrivateRoute>} />
        <Route path="/match" element={<PrivateRoute><MatchPage /></PrivateRoute>} />
      </Routes>
    </Router>
  );
};

export default App;
