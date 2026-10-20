import { useEffect, useState } from "react";
import { obtenerCatalogo } from "../services/discogs.js";

// Hook personalizado que carga el catálogo de un formato desde Discogs
// y permite ir pidiendo más páginas (scroll infinito).
export function useCatalogoDiscogs(formato) {
  const [items, setItems] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(false);

  // Carga la primera página cada vez que cambia el formato.
  useEffect(() => {
    // "activo" evita actualizar el estado si el componente se desmontó
    // (o cambió el formato) antes de que llegara la respuesta.
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
    // Función de limpieza: se ejecuta al desmontar o antes del siguiente efecto.
    return () => {
      activo = false;
    };
  }, [formato]);

  // Pide la página siguiente y la agrega al final de la lista.
  async function cargarSiguientePagina() {
    // No pedir otra página si ya hay una petición en curso o no quedan más.
    if (cargando || pagina >= totalPaginas) return;
    setCargando(true);
    try {
      const siguiente = pagina + 1;
      const datos = await obtenerCatalogo(formato, siguiente);
      // Se usa la forma funcional (prev) para no perder items ya cargados.
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
