import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [carros, setCarros] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/carros')
      .then(response => response.json())
      .then(data => setCarros(data.slice(0, 3))) // Apenas os primeiros 3
      .catch(error => console.error('Erro ao carregar carros:', error));
  }, []);

  return (
    <div>
      <header>
        <Link to="/" className="logo">
          <img src="/logo_central.png" alt="Central Veículos" />
        </Link>
        <nav>
          <Link to="/">Início</Link>
          <Link to="/estoque">Estoque</Link>
          <a href="https://wa.me/5554999999999" target="_blank" className="destaque">Conversar no WhatsApp</a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-badge">Multimarcas — Seminovos com Procedência</div>
        <h1 className="hero-titulo">SEU PRÓXIMO<br />CARRO ESTÁ<br /><em>AQUI!</em></h1>
        <p className="hero-subtitulo">Veículos revisados, com documentação em dia e preço justo. Venha conferir nosso estoque.</p>
        <div className="hero-botoes">
          <Link to="/estoque" className="btn-primario">Ver Estoque Completo →</Link>
          <a href="https://wa.me/5554999999999" className="btn-secundario" target="_blank">💬 Falar no WhatsApp</a>
        </div>

        <div className="hero-stats">
          <div className="stat">
            <div className="stat-numero">+50</div>
            <div className="stat-label">Veículos</div>
          </div>
          <div className="stat">
            <div className="stat-numero">10+</div>
            <div className="stat-label">Anos no mercado</div>
          </div>
          <div className="stat">
            <div className="stat-numero">★ 5.0</div>
            <div className="stat-label">Avaliação</div>
          </div>
        </div>
      </section>

      <section className="secao">
        <div className="secao-header">
          <h2 className="secao-titulo">🔥 EM <span>DESTAQUE</span></h2>
          <Link to="/estoque" className="secao-link">Ver todos →</Link>
        </div>
        <div className="grid-carros">
          {carros.map((carro, index) => (
            <Link key={index} to={`/carro/${index}`} className="card">
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

export default Home;