import { Link } from 'react-router-dom';
import { formatPrice } from '../utils';
import { ArrowRight } from 'lucide-react';

function VehicleCard({ carro }) {
  return (
    <article className="card">
      <Link to={`/carro/${carro.id}`} className="card-link">
        <div className="card-img-wrapper">
          <div className="card-year-badge">
            {carro.ano_modelo}
          </div>
          {carro.imagens?.[0] ? (
            <img
              src={carro.imagens[0]}
              alt={carro.nome}
            />
          ) : (
            <div className="img-placeholder">🚗</div>
          )}
        </div>

        <div className="card-body">
          <div className="card-nome">{carro.nome}</div>

          <div className="card-detalhes">
            <span className="card-detalhe">{carro.marca}</span>
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