import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Car as CarIcon, Check } from 'lucide-react';
import BrandLogo from './components/BrandLogo';
import whatsappIcon from './assets/icons/whatsapp.svg';
import { buildWhatsAppLink } from './utils';

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
  const observacoes = String(carro.observacoes || '').trim();
  const observacoesItens = observacoes
    .split(/\r?\n|\s*[•|]\s*/)
    .map((item) => item.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean);

  return (
    <main className="carro-page">
      <div className="carro-grid">
        <div className="carro-galeria">
          {imagens.length > 0 ? (
            imagens.map((img, index) => (
              <img key={index} src={img} alt={`${carro.nome} - ${index + 1}`} style={{ width: '100%', height: 'auto', marginBottom: '10px' }} />
            ))
          ) : (
            <div className="img-placeholder">🚗</div>
          )}
        </div>
        <aside className="carro-sidebar">
          <div className="carro-identidade">
            <BrandLogo
              marca={carro.marca}
              bare
              className="carro-brand-logo"
            />
            <span className="carro-marca">{carro.marca}</span>
          </div>
          <h1 className="carro-nome">{carro.nome}</h1>
          <div className="carro-preco-bloco">
            <div className="carro-preco-label">Preço</div>
            <div className="carro-preco-valor">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(carro.preco)}
            </div>
          </div>
          <div className="carro-info-card">
            <div className="carro-info-icon">
              <Calendar size={21} strokeWidth={2} />
            </div>
            <div className="carro-info-content">
              <span className="carro-info-label">Ano</span>
              <strong className="carro-info-value">{carro.ano_modelo || 'Não informado'}</strong>
            </div>
          </div>
          <div className="carro-info-card carro-sobre-card">
            <div className="carro-info-icon">
              <CarIcon size={21} strokeWidth={2} />
            </div>
            <div className="carro-info-content">
              <span className="carro-info-label">Sobre o veículo</span>
              {observacoesItens.length > 1 ? (
                <ul className="carro-observacoes-lista">
                  {observacoesItens.map((item, index) => (
                    <li key={`${item}-${index}`}>
                      <Check className="carro-observacao-check" size={17} strokeWidth={2.5} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="carro-observacoes-texto">
                  {observacoes || 'Nenhuma observação informada.'}
                </p>
              )}
            </div>
          </div>
          <a href={buildWhatsAppLink(carro)} className="btn-whatsapp" target="_blank" rel="noreferrer">
            <img src={whatsappIcon} alt="" aria-hidden="true" />
            <span>Conversar no WhatsApp</span>
          </a>
          <Link to="/estoque" className="btn-voltar-estoque">
            <ArrowLeft size={19} strokeWidth={2} />
            <span>Voltar para o estoque</span>
          </Link>
        </aside>
      </div>
    </main>
  );
}

export default Carro;