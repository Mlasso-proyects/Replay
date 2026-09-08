// ==========================================================
// buscar.ts
// Busca en Discogs mientras el usuario escribe (con un pequeño
// retraso para no saturar la API) y reemplaza los resultados
// de ejemplo por resultados reales.
// ==========================================================

(function () {
  const TOKEN_DISCOGS = "YPVKoYeIGXXpUohUUaIcKDBDbZMQilXuFPkbqoyt";
  const USER_AGENT = "ReplayTiendaVinilos/1.0";

  interface ResultadoDiscogs {
    id: number;
    title: string;
    year?: string;
    format?: string[];
    cover_image?: string;
    thumb?: string;
  }

  interface RespuestaBusquedaDiscogs {
    results: ResultadoDiscogs[];
  }

  const input = document.getElementById(
    "input-buscar",
  ) as HTMLInputElement | null;
  const contenedorResultados = document.getElementById(
    "resultados-container",
  ) as HTMLElement | null;

  // Guardamos aquí el HTML original (Recomendados/Más comprados) para
  // poder "devolverlo" cuando el usuario borre lo que escribió.
  let contenidoOriginal = "";

  // Guardamos el temporizador del "debounce" para poder cancelarlo
  let temporizador: number | undefined;

  function separarArtistaYAlbum(title: string): {
    artista: string;
    album: string;
  } {
    const partes = title.split(" - ");
    if (partes.length >= 2)
      return { artista: partes[0], album: partes.slice(1).join(" - ") };
    return { artista: "Artista desconocido", album: title };
  }

  function calcularPrecioTienda(id: number): number {
    return 60000 + (id % 40) * 1000;
  }

  function formatearPrecio(valor: number): string {
    return `COP $${valor.toLocaleString("es-CO")}`;
  }

  // Pide a Discogs los releases que coincidan con el texto escrito
  async function buscarEnDiscogs(query: string): Promise<ResultadoDiscogs[]> {
    const url = `https://api.discogs.com/database/search?q=${encodeURIComponent(query)}&type=release&per_page=10&token=${TOKEN_DISCOGS}`;
    const respuesta = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
    });
    if (!respuesta.ok) throw new Error("Error al buscar en Discogs");
    const datos: RespuestaBusquedaDiscogs = await respuesta.json();
    return datos.results;
  }

  // Arma UNA fila de resultado, reutilizando tu clase .result-row existente
  function crearFila(item: ResultadoDiscogs): string {
    const { artista, album } = separarArtistaYAlbum(item.title);
    const imagen = item.cover_image || item.thumb || "";
    const anio = item.year || "s.f.";
    const precio = calcularPrecioTienda(item.id);
    const formato = item.format && item.format.length > 0 ? item.format[0] : "";

    return `
      <div class="result-row">
        <div class="thumb" style="background-image:url('${imagen}');background-size:cover;background-position:center;"></div>
        <div class="info">
          <p class="name">${album.toUpperCase()}</p>
          <p class="artist">${artista} · ${anio}${formato ? " · " + formato : ""}</p>
          <p class="price">${formatearPrecio(precio)}</p>
        </div>
        <div class="stepper-mini">
          <button
            class="icon-btn btn-agregar-busqueda"
            style="width:32px;height:32px;border-radius:50%;"
            data-id="${item.id}" data-titulo="${album}" data-artista="${artista}"
            data-anio="${anio}" data-precio="${precio}" data-imagen="${imagen}"
          >+</button>
        </div>
        <a href="producto.html?id=${item.id}" class="ver-mas">
          ver más
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;"><path d="M9 6l6 6-6 6"/></svg>
        </a>
      </div>
    `;
  }

  // Conecta los botones "+" recién insertados con el carrito compartido
  function conectarBotonesAgregar(): void {
    contenedorResultados
      ?.querySelectorAll(".btn-agregar-busqueda")
      .forEach((boton) => {
        boton.addEventListener("click", () => {
          const el = boton as HTMLElement;
          (window as any).ReplayCarrito.agregar({
            id: Number(el.dataset.id),
            titulo: el.dataset.titulo || "",
            artista: el.dataset.artista || "",
            anio: el.dataset.anio || "",
            precio: Number(el.dataset.precio),
            imagen: el.dataset.imagen || "",
          });
          el.textContent = "✓";
          setTimeout(() => {
            el.textContent = "+";
          }, 1200);
        });
      });
  }

  function mostrarResultados(items: ResultadoDiscogs[], query: string): void {
    if (!contenedorResultados) return;

    if (items.length === 0) {
      contenedorResultados.innerHTML = `<p>No se encontraron resultados para "${query}".</p>`;
      return;
    }

    contenedorResultados.innerHTML = `
      <p class="section-tab">Resultados para "${query}"</p>
      <div class="results-list">${items.map(crearFila).join("")}</div>
    `;
    conectarBotonesAgregar();
  }

  // Se ejecuta CADA VEZ que el usuario escribe una letra en el input
  function manejarEntrada(): void {
    if (!input || !contenedorResultados) return;
    const texto = input.value.trim();

    window.clearTimeout(temporizador); // cancelamos la búsqueda anterior si el usuario sigue escribiendo

    if (texto.length === 0) {
      contenedorResultados.innerHTML = contenidoOriginal; // el usuario borró todo: mostramos lo de siempre
      return;
    }

    // "debounce": esperamos 400ms después de la última tecla antes de preguntar a la API.
    // Esto evita mandar una petición por cada letra escrita.
    temporizador = window.setTimeout(async () => {
      contenedorResultados.innerHTML = "<p>Buscando...</p>";
      try {
        const resultados = await buscarEnDiscogs(texto);
        mostrarResultados(resultados, texto);
      } catch (error) {
        console.error(error);
        contenedorResultados.innerHTML =
          "<p>Ocurrió un error al buscar. Intenta de nuevo.</p>";
      }
    }, 400);
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (!input || !contenedorResultados) return;
    contenidoOriginal = contenedorResultados.innerHTML; // guardamos el HTML original ANTES de tocar nada
    input.addEventListener("input", manejarEntrada);
  });
})();
