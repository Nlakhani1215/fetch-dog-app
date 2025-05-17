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

const SearchPage: React.FC = () => {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState('');
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [pageCursor, setPageCursor] = useState({ next: '', prev: '' });
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const pageSize = 12;

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const res = await axios.get('/dogs/breeds');
        setBreeds(res.data);
      } catch (err) {
        console.error('Breed load failed:', err);
      }
    };

    const savedFavs = localStorage.getItem('favorites');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));

    fetchBreeds();
  }, []);

  const fetchDogs = async (query: string = '') => {
    try {
      const searchRes = await axios.get(`/dogs/search${query}`, {
        params: {
          breeds: selectedBreed ? [selectedBreed] : [],
          sort: `breed:${sortOrder}`,
          size: pageSize,
        },
      });

      const ids = searchRes.data.resultIds;
      setPageCursor({ next: searchRes.data.next, prev: searchRes.data.prev });

      const detailRes = await axios.post('/dogs', ids);
      setDogs(detailRes.data);
      setMatchedDog(null);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const handleSearch = () => {
    fetchDogs();
  };

  const goToPage = (cursor: string) => {
    if (!cursor) return;
    fetchDogs(cursor);
  };

  const toggleFavorite = (id: string) => {
    const updated = favorites.includes(id)
      ? favorites.filter((fav) => fav !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const filtered = dogs.filter((dog) => {
    const combined = (dog.name + dog.breed).toLowerCase().replace(/\s+/g, '');
    const search = searchTerm.toLowerCase().replace(/\s+/g, '');
    const isFav = favorites.includes(dog.id);
    return (onlyFavorites ? isFav : true) && combined.includes(search);
  });

  return (
    <>
      <NavBar />
      <div style={{ maxWidth: 900, margin: '2rem auto', padding: '1rem' }}>
        <h2>Search Dogs</h2>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <select value={selectedBreed} onChange={(e) => setSelectedBreed(e.target.value)}>
            <option value="">All Breeds</option>
            {breeds.map((b, idx) => (
              <option key={idx} value={b}>{b}</option>
            ))}
          </select>

          <button onClick={handleSearch}>Search</button>

          <label>
            Sort:
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}>
              <option value="asc">Breed A-Z</option>
              <option value="desc">Breed Z-A</option>
            </select>
          </label>

          <label>
            <input
              type="checkbox"
              checked={onlyFavorites}
              onChange={(e) => setOnlyFavorites(e.target.checked)}
            /> Show Only Favorites
          </label>

          <input
            placeholder="Search name/breed"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1 }}
          />
        </div>

        <hr />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
          {filtered.map((dog) => (
            <div key={dog.id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: 8 }}>
              <img src={dog.img} alt={dog.name} style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 6 }} />
              <h4>{dog.name}</h4>
              <p><strong>Breed:</strong> {dog.breed}</p>
              <p><strong>Age:</strong> {dog.age}</p>
              <p><strong>Zip:</strong> {dog.zip_code}</p>
              <button onClick={() => toggleFavorite(dog.id)} style={{ fontSize: '1.2rem' }}>
                {favorites.includes(dog.id) ? '❤️ Remove' : '🤍 Favorite'}
              </button>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '1rem' }}>
          <button disabled={!pageCursor.prev} onClick={() => goToPage(pageCursor.prev)}>◀ Prev</button>
          <button disabled={!pageCursor.next} onClick={() => goToPage(pageCursor.next)} style={{ marginLeft: '1rem' }}>Next ▶</button>
        </div>
      </div>
    </>
  );
};

export default SearchPage;
