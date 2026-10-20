import { useState } from "react";

// Tema 3: Formulario controlado para registrar un lanzamiento (disco) nuevo.
// Forma del objeto que se crea (equivale a la interface de la guía):
//   { id: number, album: string, artista: string, estado: "Disponible" | "Agotado" | "Preventa" }
// Props: onAgregarLanzamiento(nuevoLanzamiento) -> función que recibe el padre (Practica.jsx).
function FormularioLanzamiento({ onAgregarLanzamiento }) {
  // Tema 3: estado del formulario controlado (un useState por cada campo).
  const [album, setAlbum] = useState("");
  const [artista, setArtista] = useState("");
  const [estado, setEstado] = useState("Disponible");

  // Tema 3: función manejadora del evento onSubmit.
  function handleSubmit(e) {
    // Tema 3: evita que el formulario recargue la página.
    e.preventDefault();

    // Tema 3: validación con .trim() para no aceptar campos vacíos.
    if (!album.trim() || !artista.trim()) return;

    // Tema 3: se crea el objeto nuevo; Date.now() sirve como id único.
    const nuevo = {
      id: Date.now(),
      album: album.trim(),
      artista: artista.trim(),
      estado,
    };

    // Tema 3: se envía el objeto al componente padre por medio de la prop.
    onAgregarLanzamiento(nuevo);

    // Tema 3: se limpian los inputs después de agregar.
    setAlbum("");
    setArtista("");
    setEstado("Disponible");
  }

  return (
    // Tema 3: evento onSubmit con su función manejadora.
    <form className="form-card" onSubmit={handleSubmit}>
      <h3>Registrar lanzamiento</h3>

      <div className="field">
        <label htmlFor="lanzamiento-album">Álbum</label>
        {/* Tema 3: input controlado: value viene del estado y onChange lo actualiza */}
        <input
          id="lanzamiento-album"
          type="text"
          value={album}
          onChange={(e) => setAlbum(e.target.value)}
          placeholder="Ej: Rumours"
        />
      </div>

      <div className="field">
        <label htmlFor="lanzamiento-artista">Artista</label>
        <input
          id="lanzamiento-artista"
          type="text"
          value={artista}
          onChange={(e) => setArtista(e.target.value)}
          placeholder="Ej: Fleetwood Mac"
        />
      </div>

      <div className="field">
        <label htmlFor="lanzamiento-estado">Estado</label>
        {/* Tema 3: select controlado con las opciones de estado */}
        <select
          id="lanzamiento-estado"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 2px",
            border: "none",
            borderBottom: "1.5px solid var(--ink)",
            background: "transparent",
            fontSize: "14.5px",
          }}
        >
          <option value="Disponible">Disponible</option>
          <option value="Agotado">Agotado</option>
          <option value="Preventa">Preventa</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-solid">
          Agregar
        </button>
      </div>
    </form>
  );
}

export default FormularioLanzamiento;
