import { useState, useEffect } from 'react';
import VehicleCard from './components/VehicleCard';

function Estoque() {
  const [carros, setCarros] = useState([]);

  useEffect(() => {
    fetch('/api/carros')
      .then((response) => response.json())
      .then((data) => setCarros(data))
      .catch((error) => console.error('Erro ao carregar carros:', error));
  }, []);

  return (
    <div>
      <div className="estoque-hero">
        <h1>ESTOQUE <span>COMPLETO</span></h1>

        <p>
          {carros.length} veículo
          {carros.length !== 1 ? 's' : ''} disponíve
          {carros.length !== 1 ? 'is' : ''}
        </p>

        <div className="estoque-filtros">
          <button className="filtro-btn ativo">
            Todos
          </button>
        </div>
      </div>

      <section className="secao">
        <div className="grid-carros">
          {carros.map((carro) => (
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