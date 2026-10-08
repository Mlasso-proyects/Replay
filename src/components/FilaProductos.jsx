import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCatalogoDiscogs } from "../hooks/useCatalogoDiscogs.js";
import { useCart } from "../context/CartContext.jsx";
import {
  separarArtistaYAlbum,
  calcularPrecioTienda,
  formatearPrecio,
} from "../utils/formato.js";

function FilaProductos({ formato }) {
  const { items, cargando, error, cargarSiguientePagina } =
    useCatalogoDiscogs(formato);
  const { agregar } = useCart();
  const contenedorRef = useRef(null);
  const [agregadoId, setAgregadoId] = useState(null);

  function moverScroll(direccion) {
    contenedorRef.current?.scrollBy({
      left: direccion * 300,
      behavior: "smooth",
    });
  }

  function alHacerScroll() {
    const el = contenedorRef.current;
    if (!el) return;
    const cercaDelFinal =
      el.scrollLeft + el.clientWidth >= el.scrollWidth - 300;
    if (cercaDelFinal) cargarSiguientePagina();
  }

  function alAgregar(item, precioNumero, artista, album, imagen, anio) {
    agregar({
      id: item.id,
      titulo: album,
      artista,
      anio,
      precio: precioNumero,
      imagen,
    });
    setAgregadoId(item.id);
    setTimeout(() => setAgregadoId(null), 1200);
  }

  if (error) return <p>No se pudo cargar el catálogo.</p>;

  return (
    <div className="products-row-wrapper">
      <button
        className="scroll-arrow left"
        onClick={() => moverScroll(-1)}
        aria-label="Anteriores"
      >
        ‹
      </button>
      <div
        className="products-grid"
        ref={contenedorRef}
        onScroll={alHacerScroll}
      >
        {items.map((item) => {
          const { artista, album } = separarArtistaYAlbum(item.title);
          const imagen = item.cover_image || item.thumb || "";
          const anio = item.year || "s.f.";
          const precioNumero = calcularPrecioTienda(item.id);
          return (
            <Link
              key={item.id}
              to={`/producto/${item.id}`}
              className="product-card"
              aria-label={`Ver detalle de ${album}`}
            >
              <div className="art">
                <img src={imagen} alt={`Portada de ${album}`} loading="lazy" />
              </div>
              <div className="meta">
                <p className="title">{album.toUpperCase()}</p>
                <p className="sub">
                  {artista} · {anio}
                </p>
                <p className="price">{formatearPrecio(precioNumero)}</p>
                <div className="actions">
                  <button
                    className="btn-outline btn-agregar"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      alAgregar(
                        item,
                        precioNumero,
                        artista,
                        album,
                        imagen,
                        anio,
                      );
                    }}
                  >
                    {agregadoId === item.id ? "Agregado ✓" : "Agregar"}
                  </button>
                </div>
              </div>
            </Link>
          );
        })}
        {items.length === 0 && !cargando && (
          <p>No se encontraron resultados.</p>
        )}
      </div>
      <button
        className="scroll-arrow right"
        onClick={() => moverScroll(1)}
        aria-label="Siguientes"
      >
        ›
      </button>
    </div>
  );
}

export default FilaProductos;
