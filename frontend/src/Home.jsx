import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroCarousel from './components/HeroCarousel';
import VehicleCarousel from './components/VehicleCarousel';
import { useCarros } from './hooks/useCarros';
import { loja } from './config/loja';
import { ArrowRight } from 'lucide-react';

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
              <h3>{item.titulo}</h3>
              <p>{item.descricao}</p>
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
            <span key={marca} className="marca-item">{marca}</span>
          ))}
        </div>
      </section>

      <section className="secao sobre">
        <div className="secao-header">
          <div>
          <h2>Sobre a empresa</h2>
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
