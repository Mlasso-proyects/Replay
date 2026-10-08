import { useEffect, useMemo, useState } from "react";
import FilaResultado from "../components/FilaResultado.jsx";
import { useCatalogoDiscogs } from "../hooks/useCatalogoDiscogs.js";
import { useCart } from "../context/CartContext.jsx";
import {
  separarArtistaYAlbum,
  calcularPrecioTienda,
} from "../utils/formato.js";

const TOKEN_DISCOGS = "YPVKoYeIGXXpUohUUaIcKDBDbZMQilXuFPkbqoyt";
const USER_AGENT = "ReplayTiendaVinilos/1.0";

function itemsFormateados(items) {
  return items.map((item) => {
    const { artista, album } = separarArtistaYAlbum(item.title);
    return {
      id: item.id,
      titulo: album,
      artista,
      anio: item.year || "s.f.",
      precio: calcularPrecioTienda(item.id),
      imagen: item.cover_image || item.thumb || "",
      formato: item.format?.length > 0 ? item.format[0] : "",
    };
  });
}

function Buscar() {
  const [texto, setTexto] = useState("");
  const [resultados, setResultados] = useState(null);
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState(false);

  // Recomendados reales: los primeros vinilos que trae Discogs (mismo catálogo que Productos)
  const { items: recomendados } = useCatalogoDiscogs("Vinyl");

  // Más comprados reales: se calculan a partir de TU historial de compras
  const { historial } = useCart();
  const masComprados = useMemo(() => {
    const conteo = {};
    historial.forEach((item) => {
      if (!conteo[item.id]) conteo[item.id] = { ...item, vecesComprado: 0 };
      conteo[item.id].vecesComprado += item.cantidad;
    });
    return Object.values(conteo)
      .sort((a, b) => b.vecesComprado - a.vecesComprado)
      .slice(0, 5);
  }, [historial]);

  useEffect(() => {
    if (texto.trim().length === 0) {
      setResultados(null);
      return;
    }
    setBuscando(true);
    setError(false);
    const temporizador = setTimeout(() => {
      fetch(
        `https://api.discogs.com/database/search?q=${encodeURIComponent(texto)}&type=release&per_page=10&token=${TOKEN_DISCOGS}`,
        {
          headers: { "User-Agent": USER_AGENT },
        },
      )
        .then((res) => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then((datos) => setResultados(datos.results))
        .catch(() => setError(true))
        .finally(() => setBuscando(false));
    }, 400);

    return () => clearTimeout(temporizador);
  }, [texto]);

  return (
    <main className="page">
      <section className="page-hero">
        <div className="container">
          <h1>BUSCAR</h1>
          <p className="lede">
            Encuentra tu próximo disco o cassette favorito.
          </p>
        </div>
      </section>

      <section className="section container">
        <div className="search-field">
          <svg
            className="icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por artista, álbum o género"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
        </div>

        <div id="resultados-container">
          {resultados === null ? (
            <>
              <p className="section-tab">Recomendados para ti</p>
              <div className="results-list">
                {itemsFormateados(recomendados.slice(0, 4)).map((item) => (
                  <FilaResultado key={item.id} item={item} />
                ))}
              </div>

              <p className="section-tab" style={{ marginTop: "36px" }}>
                Más comprados
              </p>
              <div className="results-list">
                {masComprados.length === 0 ? (
                  <p>
                    Aún no tienes compras — cuando compres algo, aparecerá aquí.
                  </p>
                ) : (
                  masComprados.map((item) => (
                    <FilaResultado key={item.id} item={item} />
                  ))
                )}
              </div>
            </>
          ) : buscando ? (
            <p>Buscando...</p>
          ) : error ? (
            <p>Ocurrió un error al buscar. Intenta de nuevo.</p>
          ) : resultados.length === 0 ? (
            <p>No se encontraron resultados para "{texto}".</p>
          ) : (
            <>
              <p className="section-tab">Resultados para "{texto}"</p>
              <div className="results-list">
                {itemsFormateados(resultados).map((item) => (
                  <FilaResultado key={item.id} item={item} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default Buscar;
