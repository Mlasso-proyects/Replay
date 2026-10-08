import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

function formatearPrecio(valor) {
  return `COP $${valor.toLocaleString("es-CO")}`;
}

function Historial() {
  const { historial } = useCart();

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
          <h1>HISTORIAL DE COMPRAS</h1>
          <p className="lede">Todo lo que has adquirido en REPLAY.</p>
        </div>
      </section>

      <section className="section container" style={{ maxWidth: "760px" }}>
        <div id="historial-items">
          {historial.length === 0 ? (
            <p>Aún no has realizado ninguna compra.</p>
          ) : (
            historial.map((item, index) => (
              <div className="line-item" key={`${item.id}-${index}`}>
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
                    {item.cantidad > 1 ? ` · ${item.cantidad} und` : ""}
                  </p>
                </div>
                <div className="price-col">
                  <span className="price">
                    {formatearPrecio(item.precio * item.cantidad)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

export default Historial;
