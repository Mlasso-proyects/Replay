import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useState } from "react";

function FilaResultado({ item }) {
  const { agregar } = useCart();
  const [agregado, setAgregado] = useState(false);

  function alAgregar() {
    agregar({
      id: item.id,
      titulo: item.titulo,
      artista: item.artista,
      anio: item.anio,
      precio: item.precio,
      imagen: item.imagen,
    });
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1200);
  }

  const estiloThumb = item.imagen
    ? {
        backgroundImage: `url('${item.imagen}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {
        background:
          item.colorFondo || "linear-gradient(160deg,#4C8B84,#241C13)",
      };

  return (
    <div className="result-row">
      <div className="thumb" style={estiloThumb}></div>
      <div className="info">
        <p className="name">{item.titulo.toUpperCase()}</p>
        <p className="artist">
          {item.artista} · {item.anio}
          {item.formato ? ` · ${item.formato}` : ""}
        </p>
        <p className="price">{`COP $${item.precio.toLocaleString("es-CO")}`}</p>
      </div>
      <div className="stepper-mini">
        <button
          className="icon-btn"
          style={{ width: "32px", height: "32px", borderRadius: "50%" }}
          onClick={alAgregar}
        >
          {agregado ? "✓" : "+"}
        </button>
      </div>
      <Link to={`/producto/${item.id}`} className="ver-mas">
        ver más
        <svg
          className="icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ width: "12px", height: "12px" }}
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
      </Link>
    </div>
  );
}

export default FilaResultado;
