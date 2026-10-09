import { useEffect, useState } from "react";
import { obtenerCatalogo } from "../services/discogs.js";

export function useCatalogoDiscogs(formato) {
  const [items, setItems] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let activo = true;
    setCargando(true);
    obtenerCatalogo(formato, 1)
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

  async function cargarSiguientePagina() {
    if (cargando || pagina >= totalPaginas) return;
    setCargando(true);
    try {
      const siguiente = pagina + 1;
      const datos = await obtenerCatalogo(formato, siguiente);
      setItems((prev) => [...prev, ...datos.results]);
      setPagina(siguiente);
    } catch {
      setError(true);
    } finally {
      setCargando(false);
    }
  }

  return { items, cargando, error, cargarSiguientePagina };
}
