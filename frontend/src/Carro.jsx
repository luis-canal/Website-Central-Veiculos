import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

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

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
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
          <Slider {...settings}>
            {carro.imagens.map((img, index) => (
              <div key={index}>
                <img src={`/${img}`} alt={`${carro.nome} - ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
              </div>
            ))}
          </Slider>
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