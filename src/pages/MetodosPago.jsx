import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

function MetodosPago() {
  const { finalizarCompra } = useCart();
  const navigate = useNavigate();

  function alContinuar(e) {
    e.preventDefault();
    const exito = finalizarCompra();
    if (!exito) {
      alert("Tu carrito está vacío. Agrega algún producto antes de continuar.");
      return;
    }
    alert("¡Compra realizada con éxito! La agregamos a tu historial.");
    navigate("/historial");
  }

  return (
    <main className="page">
      <section className="page-hero">
        <div className="container">
          <Link to="/carrito" className="back-link">
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
            Volver al carrito
          </Link>
          <h1>MÉTODOS DE PAGO</h1>
          <p className="lede">
            Agrega o actualiza tu tarjeta para finalizar la compra.
          </p>
        </div>
      </section>

      <section className="section container" style={{ maxWidth: "640px" }}>
        <div className="form-card">
          <div
            style={{
              textAlign: "center",
              color: "var(--ink-soft)",
              marginBottom: "16px",
            }}
          >
            <svg
              className="icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ width: "32px", height: "32px" }}
            >
              <path d="M9 18V6l10 6-10 6z" />
            </svg>
          </div>

          <div className="field">
            <label htmlFor="tarjeta">Número de tarjeta</label>
            <input id="tarjeta" type="text" placeholder="•••• •••• •••• ••••" />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="venc">Fecha de vencimiento</label>
              <input id="venc" type="text" placeholder="MM / AA" />
            </div>
            <div className="field">
              <label htmlFor="cvv">Código de seguridad</label>
              <input id="cvv" type="text" placeholder="CVV" />
            </div>
          </div>

          <div className="field">
            <label htmlFor="titular">Nombre del titular</label>
            <input id="titular" type="text" />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="doc">Documento de identidad</label>
              <input id="doc" type="text" />
            </div>
            <div className="field">
              <label htmlFor="tel">Número de teléfono</label>
              <input id="tel" type="tel" />
            </div>
          </div>

          <div className="field">
            <label htmlFor="dir">Dirección</label>
            <input id="dir" type="text" />
          </div>

          <div className="field">
            <label htmlFor="correo">Correo electrónico</label>
            <input id="correo" type="email" />
          </div>

          <div className="form-actions">
            <button className="btn-outline">Agregar método</button>
            <button className="btn-solid" onClick={alContinuar}>
              Continuar
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default MetodosPago;
