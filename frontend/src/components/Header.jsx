import { Link } from 'react-router-dom';
import { loja } from '../config/loja';

import whatsappIcon from '../assets/icons/whatsapp.svg';

function Header() {
  return (
    <header>
      <Link to="/" className="logo">
        <img src={loja.logo} alt={loja.nome} />
      </Link>

      <nav>
        <Link to="/">Início</Link>
        <Link to="/estoque">Estoque</Link>

        <a
          href={`https://wa.me/${loja.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="destaque whatsapp-header"
          aria-label="Conversar no WhatsApp"
        >
          <img
            src={whatsappIcon}
            alt=""
            aria-hidden="true"
            className="whatsapp-header-icon"
          />

          <span className="whatsapp-header-text">
            Conversar no WhatsApp
          </span>
        </a>
      </nav>
    </header>
  );
}

export default Header;