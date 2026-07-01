import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroCarousel from './components/HeroCarousel';
import SearchBar from './components/SearchBar';
import VehicleCard from './components/VehicleCard';
import { useCarros } from './hooks/useCarros';
import { loja } from './config/loja';

function Home() {
  const navigate = useNavigate();
  const { carros, loading, error } = useCarros();

  const destaques = useMemo(() => {
    const selecionados = carros.filter((carro) => carro.destaque);
    return selecionados.length ? selecionados : carros.slice(0, 3);
  }, [carros]);

  const handleSearch = (query) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    navigate(`/estoque?${params.toString()}`);
  };

  return (
    <div>
      <section className="hero hero-home">
        <HeroCarousel images={loja.heroImagens} />
        <div className="hero-content">
          <span className="hero-badge">{loja.subtitulo} • Seminovos</span>
          <h1 className="hero-titulo">{loja.slogan}</h1>
          <p className="hero-subtitulo">{loja.sobre}</p>
          <div className="hero-botoes">
            <button type="button" className="btn-primario" onClick={() => navigate('/estoque')}>
              Ver Estoque Completo
            </button>
            <a href={`https://wa.me/${loja.whatsapp}`} target="_blank" rel="noreferrer" className="btn-secundario">
              💬 Falar no WhatsApp
            </a>
          </div>
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      <section className="secao sobre">
        <div className="sobre-texto">
          <p className="secao-subtitulo">Sobre a empresa</p>
          <h2>{loja.nome} em David Canabarro</h2>
          <p>{loja.sobre}</p>
        </div>
      </section>

      <section className="secao destaque-veiculos">
        <div className="secao-header">
          <div>
            <h2>Veículos em <span>destaque</span></h2>
            <p>Modelos selecionados com procedência garantida e revisão completa.</p>
          </div>
          <button type="button" className="secao-link" onClick={() => navigate('/estoque')}>
            Ver todo o estoque →
          </button>
        </div>
        {loading && <p>Carregando veículos...</p>}
        {error && <p className="erro">{error}</p>}
        <div className="grid-carros">
          {destaques.map((carro) => (
            <VehicleCard key={carro.id} carro={carro} />
          ))}
        </div>
      </section>

      <section className="secao diferenciais">
        <div className="secao-header">
          <h2>Diferenciais da <span>loja</span></h2>
        </div>
        <div className="grid-diferenciais">
          {loja.diferenciais.map((item) => (
            <article key={item.titulo} className="diferencial-card">
              <h3>{item.titulo}</h3>
              <p>{item.descricao}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="secao marcas">
        <div className="secao-header">
          <h2>Marcas que trabalhamos</h2>
        </div>
        <div className="marcas-lista">
          {loja.marcas.map((marca) => (
            <span key={marca} className="marca-item">{marca}</span>
          ))}
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
          <h3>Visite nossa loja</h3>
          <p>{loja.endereco}</p>
          <p>{loja.horario.semana}</p>
          <p>{loja.horario.sabado}</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
