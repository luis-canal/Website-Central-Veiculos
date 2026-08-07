import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { formatPrice } from '../utils';

function VehicleCard({ carro }) {
  const [imageIndex, setImageIndex] = useState(0);

  const images = carro.imagens ?? [];

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <article className="card">
      <Link to={`/carro/${carro.id}`} className="card-link">

        <div className="card-img-wrapper">

          <div className="card-year-badge">
            {carro.ano_modelo}
          </div>

          {images.length > 1 && (
            <>
              <button
                type="button"
                className="card-arrow card-arrow-left"
                onClick={prevImage}
                aria-label="Imagem anterior"
              >
                <ChevronLeft size={18} strokeWidth={2.5} />
              </button>

              <button
                type="button"
                className="card-arrow card-arrow-right"
                onClick={nextImage}
                aria-label="Próxima imagem"
              >
                <ChevronRight size={18} strokeWidth={2.5} />
              </button>
            </>
          )}

          {images[imageIndex] ? (
            <img
              src={images[imageIndex]}
              alt={carro.nome}
              loading="lazy"
              style={{ aspectRatio: '16/11' }}
            />
          ) : (
            <div className="card-placeholder">🚗</div>
          )}

        </div>

        <div className="card-body">
          <div className="card-nome">
            {carro.nome}
          </div>

          <div className="card-detalhes">
            <span className="card-detalhe">
              <BrandLogo marca={carro.marca} />
              {carro.marca}
            </span>
          </div>

          <div className="card-footer">
            <div className="card-preco">
              <small>Preço</small>
              {formatPrice(carro.preco)}
            </div>

            <span className="card-btn">
              Ver detalhes
              <ArrowRight size={20} strokeWidth={1.9} />
            </span>
          </div>
        </div>

      </Link>
    </article>
  );
}

export default VehicleCard;