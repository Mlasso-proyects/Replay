// Servicio para consultar la API pública de Discogs.
// El token se lee de las variables de entorno de Vite (archivo .env / Vercel),
// así no queda escrito en el código.
const TOKEN = import.meta.env.VITE_DISCOGS_TOKEN;
const BASE_URL = "https://api.discogs.com";
// Discogs exige un User-Agent que identifique a la aplicación.
const OPCIONES = { headers: { "User-Agent": "ReplayTiendaVinilos/1.0" } };

// Hace la petición y devuelve el JSON; si la respuesta no es 2xx lanza un error
// para que quien llame pueda manejarlo con .catch() o try/catch.
async function pedir(url) {
  const res = await fetch(url, OPCIONES);
  if (!res.ok) throw new Error(`Discogs respondió con error: ${res.status}`);
  return res.json();
}

// Lista paginada del catálogo filtrada por formato ("Vinyl", "Cassette"...), 12 por página.
export function obtenerCatalogo(formato, pagina) {
  return pedir(
    `${BASE_URL}/database/search?type=release&format=${formato}&per_page=12&page=${pagina}&token=${TOKEN}`,
  );
}

// Búsqueda libre por texto (artista, álbum, género). encodeURIComponent
// escapa espacios y caracteres especiales para que la URL sea válida.
export function buscarReleases(texto) {
  return pedir(
    `${BASE_URL}/database/search?q=${encodeURIComponent(texto)}&type=release&per_page=10&token=${TOKEN}`,
  );
}

// Detalle completo de un lanzamiento (artistas, imágenes, géneros, país...).
export function obtenerRelease(id) {
  return pedir(`${BASE_URL}/releases/${id}?token=${TOKEN}`);
}
