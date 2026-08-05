import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

function SearchBar({
  mode = 'home',
  initialValue = '',
  onSearch,
  showFilters = false,
  filters = {},
  onFiltersChange,
  marcaOptions = [],
  anoOptions = [],
}) {
  const [query, setQuery] = useState(initialValue);

  useEffect(() => {
    setQuery(initialValue || '');
  }, [initialValue]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (onSearch) {
      onSearch(trimmed);
    }
  };

  const handleChange = (field, value) => {
    if (!onFiltersChange) return;
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  };

  const {
    marca = '',
    ano = '',
    precoMin = '',
    precoMax = '',
    sortBy = 'preco-asc',
  } = filters;

  return (
    <div className="searchbar-card">
      <form className="searchbar-form" onSubmit={handleSubmit}>
        <div className="searchbar-row">
          <div className="searchbar-input-field">
            <Search className="searchbar-icon" />
            <input
              type="text"
              placeholder="Busque por modelo, marca ou ano"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Buscar veículos"
            />
          </div>
          <button type="submit" className="btn-primario searchbar-button">
            Buscar
          </button>
        </div>

        {showFilters && (
          <div className="searchbar-filters">
            <label className="searchbar-filter">
              <span>Marca</span>
              <select
                value={marca}
                onChange={(event) => handleChange('marca', event.target.value)}
              >
                <option value="">Todas</option>
                {marcaOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="searchbar-filter">
              <span>Ano</span>
              <select
                value={ano}
                onChange={(event) => handleChange('ano', event.target.value)}
              >
                <option value="">Todos</option>
                {anoOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="searchbar-filter">
              <span>Preço</span>
              <div className="searchbar-price-range">
                <input
                  type="number"
                  min="0"
                  placeholder="Mínimo"
                  value={precoMin}
                  onChange={(event) => handleChange('precoMin', event.target.value)}
                  className="searchbar-input-small"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Máximo"
                  value={precoMax}
                  onChange={(event) => handleChange('precoMax', event.target.value)}
                  className="searchbar-input-small"
                />
              </div>
            </label>

            <label className="searchbar-filter">
              <span>Ordenação</span>
              <select
                value={sortBy}
                onChange={(event) => handleChange('sortBy', event.target.value)}
              >
                <option value="preco-asc">Menor preço</option>
                <option value="preco-desc">Maior preço</option>
                <option value="ano-desc">Mais novos</option>
                <option value="ano-asc">Mais antigos</option>
              </select>
            </label>
          </div>
        )}
      </form>
    </div>
  );
}

export default SearchBar;
