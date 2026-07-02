import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Estoque() {
  const [carros, setCarros] = useState([]);

  useEffect(() => {
    fetch('/api/carros')
      .then(response => response.json())
      .then(data => setCarros(data))
      .catch(error => console.error('Erro ao carregar carros:', error));
  }, []);

  return (
    <div>
      <div className="estoque-hero">
        <h1>ESTOQUE <span>COMPLETO</span></h1>
        <p>{carros.length} veículo{carros.length !== 1 ? 's' : ''} disponível{carros.length !== 1 ? 'is' : ''}</p>
        <div className="estoque-filtros">
          <button className="filtro-btn ativo">Todos</button>
        </div>
      </div>

      <section className="secao">
        <div className="grid-carros">
          {carros.map((carro) => (
            <Link key={carro.id} to={`/carro/${carro.id}`} className="card">
              <div className="card-img-wrapper">
                <img src={`/${carro.imagens[0]}`} alt={carro.nome} onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<div class=\'img-placeholder\'>🚗</div>'; }} />
              </div>
              <div className="card-body">
                <div className="card-nome">{carro.nome}</div>
                <div className="card-detalhes">
                  <span className="card-detalhe">📅 {carro.ano}</span>
                  <span className="card-detalhe">📍 {carro.km} km</span>
                </div>
                <div className="card-footer">
                  <div className="card-preco">
                    <small>a partir de</small>
                    R$ {carro.preco}
                  </div>
                  <span className="card-btn">Ver detalhes</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Estoque;