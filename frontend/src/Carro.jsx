import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function Carro() {
  const { id } = useParams();
  const [carro, setCarro] = useState(null);

  useEffect(() => {
    fetch(`/api/carro/${id}`)
      .then(response => response.json())
      .then(data => setCarro(data))
      .catch(error => console.error('Erro ao carregar carro:', error));
  }, [id]);

  if (!carro) return <div>Carregando...</div>;

  const imagens = Array.isArray(carro.imagens) ? carro.imagens : [];

  return (
    <main className="carro-page">
      <div className="carro-grid">
        <div className="carro-galeria">
          {imagens.length > 0 ? (
            imagens.map((img, index) => (
              <img key={index} src={`/${img}`} alt={`${carro.nome} - ${index + 1}`} style={{ width: '100%', height: 'auto', marginBottom: '10px' }} />
            ))
          ) : (
            <div className="img-placeholder">🚗</div>
          )}
        </div>
        <aside className="carro-sidebar">
          <div className="carro-marca">{carro.marca}</div>
          <h1 className="carro-nome">{carro.nome}</h1>
          <div className="carro-preco-bloco">
            <div className="carro-preco-label">Preço</div>
            <div className="carro-preco-valor">R$ {carro.preco}</div>
          </div>
          <div className="carro-specs">
            <div className="spec">
              <span className="spec-label">Ano:</span>
              <span className="spec-valor">{carro.ano}</span>
            </div>
            <div className="spec">
              <span className="spec-label">Quilometragem:</span>
              <span className="spec-valor">{carro.km} km</span>
            </div>
          </div>
          <a href="https://wa.me/5554999999999" className="btn-whatsapp" target="_blank" rel="noreferrer">
            💬 Conversar no WhatsApp
          </a>
          <Link to="/estoque" className="btn-voltar-estoque">
            ← Voltar para o estoque
          </Link>
        </aside>
      </div>

      <section className="carro-descricao">
        <h3>Descrição</h3>
        <p>{carro.descricao}</p>
      </section>
    </main>
  );
}

export default Carro;