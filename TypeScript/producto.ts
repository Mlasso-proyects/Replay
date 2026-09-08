// ==========================================================
// producto.ts
// Muestra el detalle de UN release de Discogs, según el id
// que llega por la URL: producto.html?id=249504
// ==========================================================

(function () {
  const TOKEN_DISCOGS = "YPVKoYeIGXXpUohUUaIcKDBDbZMQilXuFPkbqoyt"; // el mismo token de productos.ts
  const USER_AGENT = "ReplayTiendaVinilos/1.0";

  interface ReleaseDetalle {
    id: number;
    title: string; // solo el álbum (aquí SÍ viene separado)
    year: number;
    country: string;
    genres: string[];
    styles?: string[];
    artists: { name: string }[]; // arreglo de artistas
    images?: { uri: string }[]; // arreglo de imágenes (portada, contraportada...)
    formats: { name: string; qty: string }[]; // ej: [{ name: "Vinyl", qty: "1" }]
  }

  const contenedorDetalle = document.querySelector(
    ".detalle-personaje",
  ) as HTMLElement;

  function obtenerIdDesdeURL(): string | null {
    const parametros = new URLSearchParams(window.location.search);
    return parametros.get("id");
  }

  async function obtenerReleasePorId(id: string): Promise<ReleaseDetalle> {
    const url = `https://api.discogs.com/releases/${id}?token=${TOKEN_DISCOGS}`;
    const respuesta = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
    });
    if (!respuesta.ok) {
      throw new Error("No se encontró ese producto en Discogs");
    }
    return await respuesta.json();
  }

  function mostrarRelease(release: ReleaseDetalle): void {
    // el arreglo "artists" puede traer varios; los unimos con coma
    const artistas = release.artists.map((a) => a.name).join(", ");
    const imagen =
      release.images && release.images.length > 0 ? release.images[0].uri : "";
    const formato =
      release.formats && release.formats.length > 0
        ? release.formats[0].name
        : "Formato desconocido";

    contenedorDetalle.innerHTML = `
    <img src="${imagen}" alt="Portada de ${release.title}" class="detalle-imagen">
    <h1>${release.title}</h1>
    <p><strong>Artista:</strong> ${artistas}</p>
    <p><strong>Año:</strong> ${release.year}</p>
    <p><strong>Formato:</strong> ${formato}</p>
    <p><strong>Género:</strong> ${release.genres?.join(", ") || "No especificado"}</p>
    <p><strong>País de edición:</strong> ${release.country}</p>
    <p class="lede">Envío disponible a todo el país.</p>
    <button
    class="btn-outline btn-agregar-detalle"
    id="btn-agregar-detalle"
    >Agregar al carrito</button>
    <a href="productos.html" class="btn-outline">← Volver al catálogo</a>
  `;
    // Conectamos el botón recién creado con el carrito compartido
    document
      .getElementById("btn-agregar-detalle")
      ?.addEventListener("click", () => {
        (window as any).ReplayCarrito.agregar({
          id: release.id,
          titulo: release.title,
          artista: artistas,
          anio: String(release.year),
          precio: 60000 + (release.id % 40) * 1000, // mismo cálculo que en productos.ts
          imagen,
        });
      });
  }

  async function iniciarDetalle(): Promise<void> {
    if (!contenedorDetalle) return;

    const id = obtenerIdDesdeURL();
    if (!id) {
      contenedorDetalle.innerHTML = "<p>No se especificó ningún producto.</p>";
      return;
    }

    try {
      contenedorDetalle.innerHTML = "<p>Cargando...</p>";
      const release = await obtenerReleasePorId(id);
      mostrarRelease(release);
    } catch (error) {
      contenedorDetalle.innerHTML = "<p>No se pudo cargar el producto.</p>";
      console.error(error);
    }
  }

  document.addEventListener("DOMContentLoaded", iniciarDetalle);
})();
