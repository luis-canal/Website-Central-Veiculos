import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Carro() {
  const { id } = useParams();
  const [carro, setCarro] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/carro/${id}`)
      .then(response => response.json())
      .then(data => setCarro(data));
  }, [id]);

  if (!carro) return <div>Carregando...</div>;

  return (
    <div>
      <header>
        <a href="/" className="logo">
          <img src="/logo_central.png" alt="Central Veículos" />
        </a>
        <nav>
          <a href="/">Início</a>
          <a href="/estoque">Estoque</a>
          <a href="https://wa.me/5554999999999" target="_blank" className="destaque">Conversar no WhatsApp</a>
        </nav>
      </header>

      <section className="carro-detalhes">
        <div className="carro-galeria">
          <img src={`/${carro.imagem}`} alt={carro.nome} onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<div class=\'img-placeholder\'>🚗</div>'; }} />
        </div>
        <div className="carro-info">
          <h1>{carro.nome}</h1>
          <div className="carro-preco">R$ {carro.preco}</div>
          <div className="carro-especs">
            <div className="espec">
              <span className="espec-label">Ano:</span>
              <span className="espec-valor">{carro.ano}</span>
            </div>
            <div className="espec">
              <span className="espec-label">Quilometragem:</span>
              <span className="espec-valor">{carro.km} km</span>
            </div>
          </div>
          <p className="carro-descricao">{carro.descricao}</p>
          <a href="https://wa.me/5554999999999" className="btn-primario" target="_blank">💬 Conversar no WhatsApp</a>
        </div>
      </section>
    </div>
  );
}

export default Carro;