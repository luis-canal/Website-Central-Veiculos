import { loja } from '../config/loja';
import whatsappIcon from '../assets/icons/whatsapp.svg';
import instagramIcon from '../assets/icons/instagram.svg';
import facebookIcon from '../assets/icons/facebook.svg';

function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <a href="/" className="footer-logo">
          <img src={loja.logo} alt={loja.nome} />
        </a>

        <div className="footer-contact">
          <h4>Contato e Redes sociais</h4>
          <div className="social-links">
            <a href="https://wa.me/5599999999999" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="social-link whatsapp">
              <img src={whatsappIcon} alt="WhatsApp" />
            </a>
            <a href="https://facebook.com/placeholder" target="_blank" rel="noreferrer" aria-label="Facebook" className="social-link facebook">
              <img src={facebookIcon} alt="Facebook" />
            </a>
            <a href="https://instagram.com/placeholder" target="_blank" rel="noreferrer" aria-label="Instagram" className="social-link instagram">
              <img src={instagramIcon} alt="Instagram" /> 
            </a>
          </div>
        </div>

        <div className="footer-copy">
          <p>© {new Date().getFullYear()} {loja.nome}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
