import { useState, useEffect } from 'react';
import {
  Search,
  Tag,
  CalendarDays,
  Banknote,
  ArrowUpDown,
} from 'lucide-react';
import CustomSelect from './CustomSelect';

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
                  <CustomSelect
                    value={marca}
                    options={marcaOptions}
                    placeholder="Marca"
                    onChange={(value) => handleChange('marca', value)}
                    isSearchable={false}
                    aria-label="Filtrar por marca"
                  />
                </div>
              </div>
            </div>

            <div className="searchbar-filter">
              <div className="searchbar-field-row">
                <div className="searchbar-field-icon-box">
                  <CalendarDays className="searchbar-field-icon" />
                </div>
                <div className="searchbar-select-field">
                  <CustomSelect
                    value={ano}
                    options={anoOptions}
                    placeholder="Ano"
                    onChange={(value) => handleChange('ano', value)}
                    aria-label="Filtrar por ano"
                  />
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
                  <CustomSelect
                    value={sortBy}
                    options={[
                      { value: 'preco-desc', label: 'Maior preço' },
                      { value: 'preco-asc', label: 'Menor preço' },
                      { value: 'ano-desc', label: 'Mais novos' },
                      { value: 'ano-asc', label: 'Mais antigos' },
                    ]}
                    placeholder="Ordenar por"
                    onChange={(value) => handleChange('sortBy', value)}
                    aria-label="Ordenar resultados"
                  />
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