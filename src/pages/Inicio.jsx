import { Link } from "react-router-dom";
import FilaProductos from "../components/FilaProductos.jsx";

function Inicio() {
  return (
    <main className="page">
      <section className="page-hero">
        <div className="container row">
          <div>
            <h1>REPLAY</h1>
            <p className="tagline">♦ Vinilos y cassettes ♦</p>
            <p className="lede">
              Discos y casetes seleccionados para revivir el sonido análogo.
              Explora lo nuevo y lo de siempre.
            </p>
          </div>
          <Link to="/productos" className="btn-solid">
            Ver catálogo completo
          </Link>
        </div>
      </section>

      <section className="section container">
        <p className="section-tab">Recomendados</p>

        <FilaProductos formato="Vinyl" />
        <FilaProductos formato="Cassette" />

        <div style={{ textAlign: "center", marginTop: "36px" }}>
          <Link
            to="/productos"
            className="btn-outline"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
          >
            Ver más productos
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Inicio;
