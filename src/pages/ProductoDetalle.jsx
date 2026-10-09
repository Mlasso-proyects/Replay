import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { obtenerRelease } from "../services/discogs.js";
import { calcularPrecioTienda } from "../utils/formato.js";

function ProductoDetalle() {
  const { id } = useParams();
  const { agregar } = useCart();
  const [release, setRelease] = useState(null);
  const [estado, setEstado] = useState("cargando"); // 'cargando' | 'listo' | 'error'
  const [agregado, setAgregado] = useState(false);

  useEffect(() => {
    let activo = true;
    setEstado("cargando");
    obtenerRelease(id)
      .then((datos) => {
        if (!activo) return;
        setRelease(datos);
        setEstado("listo");
      })
      .catch(() => activo && setEstado("error"));
    return () => {
      activo = false;
    };
  }, [id]);

  if (estado === "cargando")
    return (
      <section className="section container detalle-personaje">
        <p>Cargando...</p>
      </section>
    );
  if (estado === "error" || !release)
    return (
      <section className="section container detalle-personaje">
        <p>No se pudo cargar el producto.</p>
      </section>
    );

  const artistas = release.artists.map((a) => a.name).join(", ");
  const imagen = release.images?.length > 0 ? release.images[0].uri : "";
  const formato =
    release.formats?.length > 0
      ? release.formats[0].name
      : "Formato desconocido";
  const precio = calcularPrecioTienda(release.id);

  function alAgregar() {
    agregar({
      id: release.id,
      titulo: release.title,
      artista: artistas,
      anio: String(release.year),
      precio,
      imagen,
    });
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1200);
  }

  return (
    <main className="page">
      <section className="section container detalle-personaje">
        <img
          src={imagen}
          alt={`Portada de ${release.title}`}
          className="detalle-imagen"
        />
        <h1>{release.title}</h1>
        <p>
          <strong>Artista:</strong> {artistas}
        </p>
        <p>
          <strong>Año:</strong> {release.year}
        </p>
        <p>
          <strong>Formato:</strong> {formato}
        </p>
        <p>
          <strong>Género:</strong>{" "}
          {release.genres?.join(", ") || "No especificado"}
        </p>
        <p>
          <strong>País de edición:</strong> {release.country}
        </p>
        <p className="lede">Envío disponible a todo el país.</p>
        <button className="btn-outline btn-agregar-detalle" onClick={alAgregar}>
          {agregado ? "Agregado ✓" : "Agregar al carrito"}
        </button>
        <Link to="/productos" className="btn-outline">
          ← Volver al catálogo
        </Link>
      </section>
    </main>
  );
}

export default ProductoDetalle;
