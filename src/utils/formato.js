// src/utils/formato.js
export function separarArtistaYAlbum(title) {
  const partes = title.split(" - ");
  if (partes.length >= 2)
    return { artista: partes[0], album: partes.slice(1).join(" - ") };
  return { artista: "Artista desconocido", album: title };
}

export function calcularPrecioTienda(id) {
  return 60000 + (id % 40) * 1000;
}

export function formatearPrecio(valor) {
  return `COP $${valor.toLocaleString("es-CO")}`;
}

export function estiloThumb(imagen) {
  return {
    backgroundImage: `url(${imagen})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}
