import { Link } from 'react-router-dom';
import { loja } from '../config/loja';

function Header() {
  return (
    <header>
      <Link to="/" className="logo">
        <img src={loja.logo} alt={loja.nome} />
      </Link>
      <nav>
        <Link to="/">Início</Link>
        <Link to="/estoque">Estoque</Link>
        <a href={`https://wa.me/${loja.whatsapp}`} target="_blank" rel="noreferrer" className="destaque">
          Conversar no WhatsApp
        </a>
      </nav>
    </header>
  );
}

export default Header;
