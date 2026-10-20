// src/utils/formato.js
// Funciones auxiliares para dar formato a los datos que llegan de Discogs.

// Discogs devuelve el título como "Artista - Álbum". Se separa por el primer
// " - " y el resto se vuelve a unir, por si el nombre del álbum también lleva guiones.
export function separarArtistaYAlbum(title) {
  const partes = title.split(" - ");
  if (partes.length >= 2)
    return { artista: partes[0], album: partes.slice(1).join(" - ") };
  return { artista: "Artista desconocido", album: title };
}

// Discogs no trae precios de venta, así que se genera uno a partir del id:
// siempre da el mismo valor para el mismo disco (entre 60.000 y 99.000 COP).
export function calcularPrecioTienda(id) {
  return 60000 + (id % 40) * 1000;
}

// Formatea un número como pesos colombianos, p. ej. 75000 -> "COP $75.000".
export function formatearPrecio(valor) {
  return `COP $${valor.toLocaleString("es-CO")}`;
}

// Estilo en línea para mostrar una imagen como fondo que cubre todo el recuadro.
export function estiloThumb(imagen) {
  return {
    backgroundImage: `url(${imagen})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}
