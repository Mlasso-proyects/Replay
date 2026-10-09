import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";

function FormularioDisco() {
  const { agregar } = useCart();
  const [titulo, setTitulo] = useState("");
  const [artista, setArtista] = useState("");
  const [precio, setPrecio] = useState("");
  const [agregado, setAgregado] = useState(false);

  function alEnviar(e) {
    e.preventDefault();
    if (!titulo.trim() || !artista.trim() || !precio) return;

    agregar({
      id: Date.now(),
      titulo: titulo.trim(),
      artista: artista.trim(),
      anio: "s.f.",
      precio: Number(precio),
      imagen: "",
    });

    setTitulo("");
    setArtista("");
    setPrecio("");
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1500);
  }

  return (
    <form
      className="form-card"
      onSubmit={alEnviar}
      style={{ marginTop: "32px" }}
    >
      <h3>¿No encuentras un disco? Pídelo aquí</h3>

      <div className="field">
        <label htmlFor="disco-titulo">Álbum</label>
        <input
          id="disco-titulo"
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ej: Abbey Road"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="disco-artista">Artista</label>
        <input
          id="disco-artista"
          type="text"
          value={artista}
          onChange={(e) => setArtista(e.target.value)}
          placeholder="Ej: The Beatles"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="disco-precio">Precio (COP)</label>
        <input
          id="disco-precio"
          type="number"
          min="1"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          placeholder="Ej: 75000"
          required
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-solid">
          {agregado ? "Agregado ✓" : "Agregar al carrito"}
        </button>
      </div>
    </form>
  );
}

export default FormularioDisco;
