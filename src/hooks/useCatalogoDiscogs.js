import { useEffect, useState } from "react";

const TOKEN_DISCOGS = "YPVKoYeIGXXpUohUUaIcKDBDbZMQilXuFPkbqoyt";
const USER_AGENT = "ReplayTiendaVinilos/1.0";

function construirURL(formato, pagina) {
  return `https://api.discogs.com/database/search?type=release&format=${formato}&per_page=12&page=${pagina}&token=${TOKEN_DISCOGS}`;
}

export function useCatalogoDiscogs(formato) {
  const [items, setItems] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(false);

  // Carga inicial (página 1)
  useEffect(() => {
    let activo = true;
    setCargando(true);
    fetch(construirURL(formato, 1), { headers: { "User-Agent": USER_AGENT } })
      .then((res) => {
        if (!res.ok)
          throw new Error(`Discogs respondió con error: ${res.status}`);
        return res.json();
      })
      .then((datos) => {
        if (!activo) return;
        setItems(datos.results);
        setTotalPaginas(datos.pagination.pages);
      })
      .catch(() => activo && setError(true))
      .finally(() => activo && setCargando(false));
    return () => {
      activo = false;
    };
  }, [formato]);

  // Trae la siguiente página y la agrega al final (scroll infinito)
  async function cargarSiguientePagina() {
    if (cargando || pagina >= totalPaginas) return;
    setCargando(true);
    try {
      const siguiente = pagina + 1;
      const res = await fetch(construirURL(formato, siguiente), {
        headers: { "User-Agent": USER_AGENT },
      });
      if (!res.ok) throw new Error();
      const datos = await res.json();
      setItems((prev) => [...prev, ...datos.results]);
      setPagina(siguiente);
    } catch {
      // si falla, simplemente no avanzamos de página
    } finally {
      setCargando(false);
    }
  }

  return { items, cargando, error, cargarSiguientePagina };
}
