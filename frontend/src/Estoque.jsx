import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import VehicleCard from './components/VehicleCard';
import SearchBar from './components/SearchBar';
import { filterCars } from './utils/filterCars';
import { loja } from './config/loja';

function Estoque() {
  const [carros, setCarros] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: '',
    marca: '',
    ano: '',
    precoMin: '',
    precoMax: '',
    sortBy: 'preco-asc',
  });

  useEffect(() => {
    fetch('/api/carros')
      .then((response) => response.json())
      .then((data) => setCarros(data))
      .catch((error) => console.error('Erro ao carregar carros:', error));
  }, []);

  useEffect(() => {
    const searchValue = searchParams.get('q') || '';
    const marcaValue = searchParams.get('marca') || '';
    const anoValue = searchParams.get('ano') || '';
    const precoMinValue = searchParams.get('precoMin') || '';
    const precoMaxValue = searchParams.get('precoMax') || '';
    const sortByValue = searchParams.get('sortBy') || 'preco-asc';

    setFilters({
      search: searchValue,
      marca: marcaValue,
      ano: anoValue,
      precoMin: precoMinValue,
      precoMax: precoMaxValue,
      sortBy: sortByValue,
    });
  }, [searchParams]);

  useEffect(() => {
    setFilteredCars(filterCars(carros, filters));
  }, [carros, filters]);

  const anoOptions = useMemo(() => {
    const anos = carros
      .map((carro) => carro?.ano)
      .filter((ano) => ano !== undefined && ano !== null)
      .map(String);

    return Array.from(new Set(anos)).sort((a, b) => Number(b) - Number(a));
  }, [carros]);

  const syncParams = (nextFilters) => {
    const params = new URLSearchParams();
    if (nextFilters.search) params.set('q', nextFilters.search);
    if (nextFilters.marca) params.set('marca', nextFilters.marca);
    if (nextFilters.ano) params.set('ano', nextFilters.ano);
    if (nextFilters.precoMin) params.set('precoMin', nextFilters.precoMin);
    if (nextFilters.precoMax) params.set('precoMax', nextFilters.precoMax);
    if (nextFilters.sortBy) params.set('sortBy', nextFilters.sortBy);

    setSearchParams(params);
  };

  const handleSearch = (query) => {
    const nextFilters = { ...filters, search: query };
    setFilters(nextFilters);
    syncParams(nextFilters);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    syncParams(newFilters);
  };

  return (
    <div>
      <div className="estoque-hero">
        <h1>ESTOQUE <span>COMPLETO</span></h1>

        <p>
          {carros.length} veículo
          {carros.length !== 1 ? 's' : ''} disponível
        </p>

        <SearchBar
          mode="estoque"
          initialValue={searchParams.get('q') || ''}
          onSearch={handleSearch}
          showFilters={true}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          marcaOptions={loja.marcas}
          anoOptions={anoOptions}
        />
      </div>

      <section className="secao">
        <div className="grid-carros">
          {filteredCars.map((carro) => (
            <VehicleCard
              key={carro.id}
              carro={carro}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Estoque;
