import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function Carro() {
  const { id } = useParams();
  const [carro, setCarro] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/carro/${id}`)
      .then(response => response.json())
      .then(data => setCarro(data))
      .catch(error => console.error('Erro ao carregar carro:', error));
  }, [id]);

  if (!carro) return <div>Carregando...</div>;

  // Verificar se imagens é um array válido
  const imagens = Array.isArray(carro.imagens) ? carro.imagens : [];

  const settings = {
    dots: true,
    infinite: imagens.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: imagens.length > 1,
    autoplaySpeed: 3000,
  };

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

      <section className="carro-detalhes">
        <div className="carro-galeria">
          {imagens.length > 0 ? (
            imagens.map((img, index) => (
              <img key={index} src={`/${img}`} alt={`${carro.nome} - ${index + 1}`} style={{ width: '100%', height: 'auto', marginBottom: '10px' }} />
            ))
          ) : (
            <div className="img-placeholder">🚗</div>
          )}
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