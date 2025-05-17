import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

const MatchPage: React.FC = () => {
  const [match, setMatch] = useState<Dog | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const favorites = localStorage.getItem('favorites');
    if (!favorites) {
      setError('No favorites found. Please add some first.');
      return;
    }

    const favIds: string[] = JSON.parse(favorites);
    if (favIds.length === 0) {
      setError('You must add favorites before getting a match.');
      return;
    }

    const fetchMatch = async () => {
      try {
        const matchRes = await axios.post('/dogs/match', favIds);
        const matchedId = matchRes.data.match;

        const detailRes = await axios.post('/dogs', [matchedId]);
        setMatch(detailRes.data[0]);
      } catch (err) {
        console.error('Failed to get match:', err);
        setError('Could not find a match. Please try again.');
      }
    };

    fetchMatch();
  }, []);

  return (
    <>
      <NavBar />
      <div style={{ maxWidth: 600, margin: '2rem auto', padding: '1rem' }}>
        <h2>🎯 Your Matched Dog</h2>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {match && (
          <div style={{ border: '2px dashed green', padding: '1rem', borderRadius: '10px' }}>
            <img src={match.img} alt={match.name} style={{ width: '100%', borderRadius: '8px', height: 250, objectFit: 'cover' }} />
            <h3>{match.name}</h3>
            <p><strong>Breed:</strong> {match.breed}</p>
            <p><strong>Age:</strong> {match.age}</p>
            <p><strong>Zip Code:</strong> {match.zip_code}</p>
          </div>
        )}

        <button onClick={() => navigate('/search')} style={{ marginTop: '2rem' }}>
          🔙 Back to Search
        </button>
      </div>
    </>
  );
};

export default MatchPage;
