import { loja } from '../config/loja';

function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <a href="/" className="footer-logo">
          <img src={loja.logo} alt={loja.nome} />
        </a>
        <div className="footer-copy">
          <p>{loja.nome} • {loja.subtitulo}</p>
          <p>© {new Date().getFullYear()} {loja.nome}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
