import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

function formatearPrecio(valor) {
  return `COP $${valor.toLocaleString("es-CO")}`;
}

function Carrito() {
  const { carrito, cambiarCantidad } = useCart();
  const navigate = useNavigate();

  const subtotal = carrito.reduce(
    (suma, item) => suma + item.precio * item.cantidad,
    0,
  );
  const envio = carrito.length > 0 ? 12000 : 0;
  const total = subtotal + envio;

  return (
    <main className="page">
      <section className="page-hero">
        <div className="container">
          <h1>COMPRA DE PRODUCTOS</h1>
          <p className="lede">
            Revisa tu carrito antes de finalizar la compra.
          </p>
        </div>
      </section>

      <section className="section container">
        <div className="layout-2col">
          <div id="carrito-items">
            {carrito.length === 0 ? (
              <p>Tu carrito está vacío.</p>
            ) : (
              carrito.map((item) => (
                <div className="line-item" key={item.id}>
                  <div
                    className="thumb"
                    style={{
                      backgroundImage: `url('${item.imagen}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>
                  <div className="info">
                    <p className="name">{item.titulo.toUpperCase()}</p>
                    <p className="artist">
                      {item.artista} · {item.anio}
                    </p>
                  </div>
                  <div className="price-col">
                    <span className="price">
                      {formatearPrecio(item.precio * item.cantidad)}
                    </span>
                    <div className="qty-stepper">
                      <button
                        className="step"
                        onClick={() => cambiarCantidad(item.id, 1)}
                      >
                        +
                      </button>
                      <span className="n">{item.cantidad} UND</span>
                      <button
                        className="step"
                        onClick={() => cambiarCantidad(item.id, -1)}
                      >
                        –
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <aside className="panel sticky">
            <h2>Resumen</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatearPrecio(subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Envío</span>
              <span>{formatearPrecio(envio)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>{formatearPrecio(total)}</span>
            </div>

            <div className="action-list" style={{ marginTop: "20px" }}>
              <Link to="/metodos-pago" className="action-row primary">
                <span className="glyph">
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
                </span>
                Finalizar compra
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default Carrito;
