import { useState, useEffect } from 'react';
import {
  Search,
  Tag,
  CalendarDays,
  Banknote,
  ArrowUpDown,
} from 'lucide-react';

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
            <div className="searchbar-filter">
              <div className="searchbar-field-row">
                <div className="searchbar-field-icon-box">
                  <Tag className="searchbar-field-icon" />
                </div>
                <div className="searchbar-select-field">
                  <select
                    value={marca}
                    onChange={(event) => handleChange('marca', event.target.value)}
                    aria-label="Filtrar por marca"
                  >
                    <option value="">Marca</option>
                    {marcaOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="searchbar-filter">
              <div className="searchbar-field-row">
                <div className="searchbar-field-icon-box">
                  <CalendarDays className="searchbar-field-icon" />
                </div>
                <div className="searchbar-select-field">
                  <select
                    value={ano}
                    onChange={(event) => handleChange('ano', event.target.value)}
                    aria-label="Filtrar por ano"
                  >
                    <option value="">Ano</option>
                    {anoOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="searchbar-filter">
              <div className="searchbar-price-range">
                <div className="searchbar-field-row searchbar-price-first">
                  <div className="searchbar-field-icon-box">
                    <Banknote className="searchbar-field-icon" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    placeholder="Preço mínimo"
                    value={precoMin}
                    onChange={(event) => handleChange('precoMin', event.target.value)}
                    className="searchbar-input-small"
                    aria-label="Preço mínimo"
                  />
                </div>

                <div className="searchbar-field-row">
                  <input
                    type="number"
                    min="0"
                    placeholder="Preço máximo"
                    value={precoMax}
                    onChange={(event) => handleChange('precoMax', event.target.value)}
                    className="searchbar-input-small"
                    aria-label="Preço máximo"
                  />
                </div>
              </div>
            </div>

            <div className="searchbar-filter">
              <div className="searchbar-field-row">
                <div className="searchbar-field-icon-box">
                  <ArrowUpDown className="searchbar-field-icon" />
                </div>
                <div className="searchbar-select-field">
                  <select
                    value={sortBy}
                    onChange={(event) => handleChange('sortBy', event.target.value)}
                    aria-label="Ordenar resultados"
                  >
                    <option value="preco-desc">Maior preço</option>
                    <option value="preco-asc">Menor preço</option>
                    <option value="ano-desc">Mais novos</option>
                    <option value="ano-asc">Mais antigos</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default SearchBar;