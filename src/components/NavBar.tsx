import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const NavBar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (err) {
      console.warn('Logout API failed, clearing anyway.');
    }
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      background: '#eee',
      borderBottom: '1px solid #ccc'
    }}>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/search">🐶 Search</Link>
        <Link to="/favorites">❤️ Favorites</Link>
        <Link to="/match">🎯 Match</Link>
      </div>
      <button onClick={handleLogout} style={{ backgroundColor: '#f44336', color: 'white', padding: '6px 12px', border: 'none' }}>
        🚪 Logout
      </button>
    </nav>
  );
};

export default NavBar;
