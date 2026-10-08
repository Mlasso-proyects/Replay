import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <p className="brand-name" style={{ fontSize: "18px" }}>
            REPLAY
          </p>
          <p className="tagline">♦ Vinilos y cassettes ♦</p>
        </div>
        <nav className="footer-links">
          <Link to="/nosotros">Nosotros</Link>
          <Link to="/configuracion">Configuración</Link>
          <Link to="/metodos-pago">Métodos de pago</Link>
        </nav>
        <p className="copyright">© 2026 REPLAY — Hecho para melómanos.</p>
      </div>
    </footer>
  );
}

export default Footer;
