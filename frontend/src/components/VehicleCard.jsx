import { Link } from 'react-router-dom';
import { formatPrice } from '../utils';

function VehicleCard({ carro }) {
  return (
    <article className="card">
      <Link to={`/carro/${carro.id}`} className="card-link">
        <div className="card-img-wrapper">
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
            <span className="card-detalhe">{carro.ano_modelo}</span>
          </div>

          <div className="card-footer">
            <div className="card-preco">
              <small>Preço</small>
              {formatPrice(carro.preco)}
            </div>

            <span className="card-btn">
              Ver detalhes
            </span>
          </div>
        </div>
      </Link>

    </article>
  );
}

export default VehicleCard;