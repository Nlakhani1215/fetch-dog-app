import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import NavBar from '../components/NavBar';

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      const favIds = JSON.parse(stored);
      setFavorites(favIds);
      fetchFavoriteDogs(favIds);
    }
  }, []);

  const fetchFavoriteDogs = async (ids: string[]) => {
    if (ids.length === 0) {
      setDogs([]);
      return;
    }

    try {
      const response = await axios.post('/dogs', ids);
      setDogs(response.data);
    } catch (err) {
      console.error('Failed to load favorite dogs:', err);
      setError('Failed to load favorites.');
    }
  };

  const removeFavorite = (dogId: string) => {
    const updated = favorites.filter((id) => id !== dogId);
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
    setDogs((prev) => prev.filter((dog) => dog.id !== dogId));
  };

  return (
    <>
      <NavBar />
      <div style={{ maxWidth: 900, margin: '2rem auto', padding: '1rem' }}>
        <h2>Your Favorite Dogs</h2>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {dogs.length === 0 && <p>You haven't added any favorites yet.</p>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
          {dogs.map((dog) => (
            <div key={dog.id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
              <img src={dog.img} alt={dog.name} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: 6 }} />
              <h4>{dog.name}</h4>
              <p><strong>Breed:</strong> {dog.breed}</p>
              <p><strong>Age:</strong> {dog.age}</p>
              <p><strong>Zip:</strong> {dog.zip_code}</p>
              <button onClick={() => removeFavorite(dog.id)} style={{ backgroundColor: '#f44336', color: 'white', marginTop: '10px' }}>
                ❌ Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FavoritesPage;
