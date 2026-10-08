import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { estiloThumb } from "../utils/formato.js";

function Perfil() {
  const { usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();
  const { historial } = useCart();
  const comprasRecientes = historial.slice(-2).reverse();

  function alCerrarSesion() {
    cerrarSesion();
    navigate("/login");
  }
  return (
    <main className="page">
      <section className="page-hero">
        <div className="container">
          <h1>INFORMACIÓN DEL USUARIO</h1>
          <p className="lede">
            Gestiona tus datos, métodos de pago y compras anteriores.
          </p>
        </div>
      </section>

      <section className="section container">
        <div className="layout-2col">
          <div>
            <div className="field-grid">
              <div className="field">
                <label>Nombre</label>
                <input type="text" defaultValue={usuario?.nombre || ""} />
              </div>
              <div className="field">
                <label>Teléfono</label>
                <input type="text" defaultValue={usuario?.telefono || "+57"} />
              </div>
              <div className="field">
                <label>Nombre de usuario</label>
                <input
                  type="text"
                  defaultValue={usuario?.nombreUsuario || ""}
                />
              </div>
              <div className="field">
                <label>Método de pago</label>
                <div
                  className="static"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  VISA
                  <span style={{ display: "inline-flex" }}>
                    <span
                      style={{
                        width: "14px",
                        height: "14px",
                        borderRadius: "50%",
                        background: "var(--clay)",
                        display: "inline-block",
                      }}
                    ></span>
                    <span
                      style={{
                        width: "14px",
                        height: "14px",
                        borderRadius: "50%",
                        background: "var(--mustard)",
                        display: "inline-block",
                        marginLeft: "-6px",
                      }}
                    ></span>
                  </span>
                </div>
              </div>
              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label>Correo electrónico</label>
                <input type="email" defaultValue={usuario?.correo || ""} />
              </div>
            </div>

            <p className="block-title">Compras anteriores</p>
            {comprasRecientes.length === 0 ? (
              <p>Aún no has realizado ninguna compra.</p>
            ) : (
              <div className="mini-cards">
                {comprasRecientes.map((item, index) => (
                  <div className="mini-card" key={`${item.id}-${index}`}>
                    <div className="art" style={estiloThumb(item.imagen)}></div>
                    <p className="name">{item.titulo.toUpperCase()}</p>
                    <p className="price">{`$${(item.precio * item.cantidad).toLocaleString("es-CO")}`}</p>
                  </div>
                ))}
                <Link
                  to="/historial"
                  className="mini-card more"
                  aria-label="Ver más"
                >
                  <svg
                    className="icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </Link>
              </div>
            )}
          </div>

          <aside>
            <div className="profile-card">
              <div className="profile-photo">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--ink)"
                  strokeWidth="2"
                  style={{ width: "48px", height: "48px" }}
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
                    style={{ width: "16px", height: "16px" }}
                  >
                    <path d="M4 8h3l2-2h6l2 2h3v11H4z" />
                    <circle cx="12" cy="13" r="3" />
                  </svg>
                </span>
              </div>
              <h2>{usuario?.nombre || "Invitado"}</h2>
              <p className="role">MIEMBRO DESDE {new Date().getFullYear()}</p>
            </div>

            <Link
              to="/configuracion"
              className="pill-btn solid"
              style={{ marginTop: "20px" }}
            >
              Ver más ajustes
            </Link>
            <button
              className="pill-btn"
              style={{ marginTop: "10px" }}
              onClick={alCerrarSesion}
            >
              Cerrar sesión
            </button>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default Perfil;
