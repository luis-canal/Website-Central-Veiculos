import { useState } from 'react';

function SearchBar({ onSearch, initialValue = '' }) {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (onSearch) {
      onSearch(trimmed);
    }
  };

  return (
    <form className="busca-rapida" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Buscar por modelo, marca ou versão"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        aria-label="Buscar veículos"
      />
      <button type="submit">Buscar</button>
    </form>
  );
}

export default SearchBar;
