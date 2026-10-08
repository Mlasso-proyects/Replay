import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function Header() {
  const { totalUnidades } = useCart();
  const { usuario } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">♦</span>
          <span className="brand-name">REPLAY</span>
        </Link>

        <nav className={`main-nav ${menuAbierto ? "open" : ""}`}>
          <Link to="/" onClick={() => setMenuAbierto(false)}>
            Inicio
          </Link>
          <Link to="/productos" onClick={() => setMenuAbierto(false)}>
            Productos
          </Link>
          <Link to="/buscar" onClick={() => setMenuAbierto(false)}>
            Buscar
          </Link>
          <Link to="/carrito" onClick={() => setMenuAbierto(false)}>
            Compras
          </Link>
          <Link to="/nosotros" onClick={() => setMenuAbierto(false)}>
            Nosotros
          </Link>
        </nav>

        <div className="header-actions">
          <Link to="/carrito" className="icon-link" aria-label="Carrito">
            <svg
              className="icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2 3h2l2.6 12.4a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L21 7H6" />
            </svg>
            <span className="badge">{totalUnidades}</span>
          </Link>
          <Link
            to={usuario ? "/perfil" : "/login"}
            className="icon-link avatar-link"
            aria-label={usuario ? "Perfil" : "Iniciar sesión"}
          >
            <svg
              className="icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--ink)"
              strokeWidth="2"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c1.8-4 5-6 8-6s6.2 2 8 6" />
            </svg>
          </Link>
          <button
            className="menu-toggle"
            aria-label="Menú"
            aria-expanded={menuAbierto}
            onClick={() => setMenuAbierto((v) => !v)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
      <div className="spool-stripe">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </header>
  );
}

export default Header;
