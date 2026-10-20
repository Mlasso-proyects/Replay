import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";

// Formulario para pedir un disco que no está en el catálogo:
// lo agrega directamente al carrito con los datos que escribe el usuario.
function FormularioDisco() {
  const { agregar } = useCart();
  // Inputs controlados: cada campo guarda su valor en el estado.
  const [titulo, setTitulo] = useState("");
  const [artista, setArtista] = useState("");
  const [precio, setPrecio] = useState("");
  const [agregado, setAgregado] = useState(false);

  function alEnviar(e) {
    // Evita que el formulario recargue la página.
    e.preventDefault();
    // Validación: no se aceptan campos vacíos o solo con espacios.
    if (!titulo.trim() || !artista.trim() || !precio) return;

    agregar({
      // Date.now() sirve como id único porque estos discos no vienen de Discogs.
      id: Date.now(),
      titulo: titulo.trim(),
      artista: artista.trim(),
      anio: "s.f.",
      precio: Number(precio),
      imagen: "",
    });

    // Limpia el formulario y muestra la confirmación durante 1,5 segundos.
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
