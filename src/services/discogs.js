const TOKEN = import.meta.env.VITE_DISCOGS_TOKEN;
const BASE_URL = "https://api.discogs.com";
const OPCIONES = { headers: { "User-Agent": "ReplayTiendaVinilos/1.0" } };

async function pedir(url) {
  const res = await fetch(url, OPCIONES);
  if (!res.ok) throw new Error(`Discogs respondió con error: ${res.status}`);
  return res.json();
}

export function obtenerCatalogo(formato, pagina) {
  return pedir(
    `${BASE_URL}/database/search?type=release&format=${formato}&per_page=12&page=${pagina}&token=${TOKEN}`,
  );
}

export function buscarReleases(texto) {
  return pedir(
    `${BASE_URL}/database/search?q=${encodeURIComponent(texto)}&type=release&per_page=10&token=${TOKEN}`,
  );
}

export function obtenerRelease(id) {
  return pedir(`${BASE_URL}/releases/${id}?token=${TOKEN}`);
}
