import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroCarousel from './components/HeroCarousel';
import VehicleCarousel from './components/VehicleCarousel';
import BrandLogo from './components/BrandLogo';
import { useCarros } from './hooks/useCarros';
import { loja } from './config/loja';
import { ArrowRight, Clock3, MapPin } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShield, faSuitcase, faHandshake, faCar } from '@fortawesome/free-solid-svg-icons';

const iconesDiferenciais = {
  shield: faShield,
  suitcase: faSuitcase,
  handshake: faHandshake,
  car: faCar,
};

function Home() {
  const navigate = useNavigate();
  const { carros, loading, error } = useCarros();

  const destaques = useMemo(() => {
    const selecionados = carros.filter((carro) => carro.destaque);
    return selecionados.length ? selecionados : carros.slice(0, 10);
  }, [carros]);

  const handleSearch = (query) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    navigate(`/estoque?${params.toString()}`);
  };

  return (
    <div>
      <section className="hero-home">
        <HeroCarousel images={loja.heroImagens} />
      </section>

      <section className="secao destaque-veiculos">
        <div className="secao-header">
          <div>
            <h2>Veículos em <span>destaque</span></h2>
            <p>Modelos selecionados com procedência garantida</p>
          </div>
          <button type="button" className="secao-link" onClick={() => navigate('/estoque')}>
            Ver todo o estoque
            <ArrowRight size={20} strokeWidth={1.9} />
          </button>
        </div>
        {loading && <p>Carregando veículos...</p>}
        {error && <p className="erro">{error}</p>}
        {!loading && !error && (
          <VehicleCarousel vehicles={destaques} />
        )}
      </section>

      <section className="secao diferenciais">
        <div className="secao-header">
          <div className="diferenciais-texto">
            <h2><span>Diferenciais</span> da loja</h2>
            <p>Mais segurança, transparência e facilidade para você</p>
          </div>
        </div>
        <div className="grid-diferenciais">
          {loja.diferenciais.map((item) => (
            <article key={item.titulo} className="diferencial-card">
              <div className="diferencial-card-body">
                <div className="icone-diferencial">
                  <FontAwesomeIcon icon={iconesDiferenciais[item.icone]} />
                </div>
                <div className="diferencial-card-textos">
                  <h3>{item.titulo}</h3>
                  <p>{item.descricao}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="secao marcas">
        <div className="secao-header">
          <div>
          <h2><span>Marcas</span> que trabalhamos</h2>
          <p>Diversas marcas disponíveis em nosso catálogo</p>
          </div>
        </div>
        <div className="marcas-lista">
          {loja.marcas.map((marca) => (
            <div key={marca} className="marca-card">
              <BrandLogo marca={marca} />
              <span>{marca}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="secao sobre">
        <div className="secao-header">
          <div>
          <h2>Sobre a <span>{loja.nome}</span></h2>
          <p>{loja.sobre}</p>
          </div>
        </div>
      </section>

      <section className="secao mapa">
        <div className="mapa-iframe">
          <iframe
            title="Localização Central Veículos"
            src={loja.mapsEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="mapa-info">
          <div className="mapa-info-header">
            <h3><span>Visite</span> nossa loja</h3>
          </div>
          <div className="mapa-item-card">
            <div className="mapa-item-icon">
              <MapPin size={18} strokeWidth={2} />
            </div>
            <div className="mapa-item-content">
              <h4>Endereço</h4>
              <p>{loja.endereco}</p>
            </div>
          </div>
          <div className="mapa-divider-horizontal" />
          <div className="mapa-item-card mapa-horario-card">
            <div className="mapa-item-icon">
              <Clock3 size={18} strokeWidth={2} />
            </div>
            <div className="mapa-item-content mapa-horario-content">
              <h4>Horário</h4>
              <div className="mapa-horario-grid">
                <div className="mapa-horario-coluna">
                  <p className="mapa-horario-label">Segunda a sexta</p>
                  <p>{loja.horario.semana}</p>
                </div>
                <div className="mapa-horario-coluna mapa-horario-coluna-separador">
                  <p className="mapa-horario-label">Sábado</p>
                  <p>{loja.horario.sabado}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
