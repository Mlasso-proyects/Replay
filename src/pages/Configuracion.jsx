import { Link } from "react-router-dom";

function Configuracion() {
  return (
    <main className="page">
      <section className="page-hero">
        <div className="container">
          <Link to="/perfil" className="back-link">
            <svg
              className="icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ width: "14px", height: "14px" }}
            >
              <path d="M15 6l-6 6 6 6" />
            </svg>
            Volver al perfil
          </Link>
          <h1>CONFIGURACIÓN</h1>
          <p className="lede">Administra tu cuenta y preferencias.</p>
        </div>
      </section>

      <section className="section container">
        <div className="layout-2col">
          <div className="settings-list">
            <a href="#" className="settings-item">
              Autenticación <span className="chev">›</span>
            </a>
            <a href="#" className="settings-item">
              Preferencias de pantalla <span className="chev">›</span>
            </a>
            <a href="#" className="settings-item">
              Accesibilidad <span className="chev">›</span>
            </a>
            <a href="#" className="settings-item">
              Actividad <span className="chev">›</span>
            </a>
            <Link to="/historial" className="settings-item">
              Historial <span className="chev">›</span>
            </Link>
            <Link to="/metodos-pago" className="settings-item">
              Método de pago <span className="chev">›</span>
            </Link>
            <a href="#" className="settings-item">
              Preferencias <span className="chev">›</span>
            </a>
            <Link to="/historial" className="settings-item">
              Compras realizadas <span className="chev">›</span>
            </Link>
            <Link to="/nosotros" className="settings-item">
              Soporte <span className="chev">›</span>
            </Link>
          </div>

          <aside className="panel">
            <div
              className="profile-photo"
              style={{ width: "88px", height: "88px" }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--ink)"
                strokeWidth="2"
                style={{ width: "36px", height: "36px" }}
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c1.8-4 5-6 8-6s6.2 2 8 6" />
              </svg>
              <span className="cam">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--ink)"
                  strokeWidth="2"
                  style={{ width: "14px", height: "14px" }}
                >
                  <path d="M4 8h3l2-2h6l2 2h3v11H4z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
              </span>
            </div>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "13px",
                fontWeight: 700,
                margin: "14px 0 2px",
              }}
            >
              Ana Sofía Muñoz
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "var(--ink-soft)",
                margin: "0 0 18px",
              }}
            >
              ana.munoz@correo.com
            </p>

            <a href="#" className="pill-btn" style={{ marginBottom: "10px" }}>
              Cerrar sesión
            </a>
            <a href="#" className="pill-btn">
              Agregar cuenta
            </a>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default Configuracion;
