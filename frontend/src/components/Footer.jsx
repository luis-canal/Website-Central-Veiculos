import { loja } from '../config/loja';

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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 11.5C21 6.25 16.75 2 11.5 2S2 6.25 2 11.5c0 2 .6 3.85 1.7 5.4L2 22l5.3-1.6c1.4.7 3 .9 4.6.9 5.25 0 9.5-4.25 9.5-9.5z" fill="#25D366"/><path d="M17 15.5c-.3-.1-1.8-.9-2-.9-.2 0-.3-.1-.4-.3-.1-.1-.5-.6-.7-.8-.2-.2-.3-.3-.5-.6-.2-.2-.4-.3-.6-.3s-.4 0-.6 0c-.2 0-.5.1-.8.5-.3.4-1 1.4-1 2.1s.9 1.8 2 2.4c1.1.6 2.4.8 3 .6.1 0 .9-.4 1-.5.2-.1.5-.3.6-.5.1-.1.1-.3 0-.4-.1-.1-.4-.3-.7-.4z" fill="#fff"/></svg>
            </a>
            <a href="https://facebook.com/placeholder" target="_blank" rel="noreferrer" aria-label="Facebook" className="social-link facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 12C22 6.48 17.52 2 12 2S2 6.48 2 12c0 4.99 3.66 9.12 8.44 9.88v-6.99H8.9v-2.9h1.54V9.41c0-1.52.9-2.36 2.28-2.36.66 0 1.35.12 1.35.12v1.5h-.77c-.76 0-1 .48-1 0v1.16h1.71l-.27 2.9h-1.44v6.99C18.34 21.12 22 16.99 22 12z" fill="#1877F2"/><path d="M15.27 14.79l.27-2.9h-1.71v-1.16c0 .48.24 0 1 0h.77v-1.5s-.69-.12-1.35-.12c-1.38 0-2.28.84-2.28 2.36v1.4H8.9v2.9h1.54v6.99c.89.12 1.79.18 2.7.18.91 0 1.81-.06 2.7-.18v-6.99h-1.54z" fill="#fff"/></svg>
            </a>
            <a href="https://instagram.com/placeholder" target="_blank" rel="noreferrer" aria-label="Instagram" className="social-link instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="5" fill="#E1306C"/><path d="M12 7.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2z" fill="#fff"/><circle cx="17.6" cy="6.4" r="1" fill="#fff"/></svg>
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
