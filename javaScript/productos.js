"use strict";
// ==========================================================
// productos.ts
// Consulta Discogs, llena las filas de Vinilos y Cassettes
// como carruseles horizontales, con scroll infinito hacia la
// derecha y botón "Agregar" conectado al carrito.
// ==========================================================
(function () {
    const TOKEN_DISCOGS = "YPVKoYeIGXXpUohUUaIcKDBDbZMQilXuFPkbqoyt";
    const USER_AGENT = "ReplayTiendaVinilos/1.0";
    // 1) Estado de paginación por formato: en qué página vamos, cuántas hay
    //    en total, y si ya hay una petición en curso (para no duplicar pedidos).
    const estado = {
        Vinyl: { pagina: 1, totalPaginas: 1, cargando: false },
        Cassette: { pagina: 1, totalPaginas: 1, cargando: false },
    };
    function construirURL(formato, pagina) {
        return `https://api.discogs.com/database/search?type=release&format=${formato}&per_page=12&page=${pagina}&token=${TOKEN_DISCOGS}`;
    }
    async function buscarPorFormato(formato, pagina) {
        const respuesta = await fetch(construirURL(formato, pagina), {
            headers: { "User-Agent": USER_AGENT },
        });
        if (!respuesta.ok)
            throw new Error(`Discogs respondió con error: ${respuesta.status}`);
        return await respuesta.json();
    }
    function separarArtistaYAlbum(title) {
        const partes = title.split(" - ");
        if (partes.length >= 2)
            return { artista: partes[0], album: partes.slice(1).join(" - ") };
        return { artista: "Artista desconocido", album: title };
    }
    function calcularPrecioTienda(id) {
        return 60000 + (id % 40) * 1000; // precio simulado, propio de Replay
    }
    function formatearPrecio(valor) {
        return `COP $${valor.toLocaleString("es-CO")}`;
    }
    // 2) Tarjeta con data-* en el botón "Agregar", para leer esos datos al hacer clic
    function crearTarjeta(item) {
        const { artista, album } = separarArtistaYAlbum(item.title);
        const imagen = item.cover_image || item.thumb || "";
        const anio = item.year || "s.f.";
        const precioNumero = calcularPrecioTienda(item.id);
        return `
      <a href="producto.html?id=${item.id}" class="product-card" aria-label="Ver detalle de ${album}">
        <div class="art"><img src="${imagen}" alt="Portada de ${album}" loading="lazy"></div>
        <div class="meta">
          <p class="title">${album.toUpperCase()}</p>
          <p class="sub">${artista} · ${anio}</p>
          <p class="price">${formatearPrecio(precioNumero)}</p>
          <div class="actions">
            <button
              class="btn-outline btn-agregar"
              data-id="${item.id}"
              data-titulo="${album}"
              data-artista="${artista}"
              data-anio="${anio}"
              data-precio="${precioNumero}"
              data-imagen="${imagen}"
            >Agregar</button>
          </div>
        </div>
      </a>
    `;
    }
    // 3) "agregar=true" inserta al final (para scroll infinito); "false" reemplaza todo (carga inicial)
    function pintarEnContenedor(idContenedor, items, agregar) {
        const contenedor = document.getElementById(idContenedor);
        if (!contenedor)
            return;
        const html = items.map(crearTarjeta).join("");
        if (agregar) {
            contenedor.insertAdjacentHTML("beforeend", html);
        }
        else {
            contenedor.innerHTML = html || "<p>No se encontraron resultados.</p>";
        }
    }
    // 4) Delegación de eventos: UN solo listener en el contenedor detecta
    //    los clics en CUALQUIER botón "Agregar", aunque se hayan creado después
    //    (por el scroll infinito). Esto evita tener que re-conectar cada botón nuevo.
    function habilitarAgregarAlCarrito(idContenedor) {
        const contenedor = document.getElementById(idContenedor);
        if (!contenedor)
            return;
        contenedor.addEventListener("click", (evento) => {
            const boton = evento.target.closest(".btn-agregar");
            if (!boton)
                return; // el clic no fue sobre "Agregar"
            evento.preventDefault(); // evita seguir el link <a> de la tarjeta
            evento.stopPropagation();
            window.ReplayCarrito.agregar({
                id: Number(boton.dataset.id),
                titulo: boton.dataset.titulo || "",
                artista: boton.dataset.artista || "",
                anio: boton.dataset.anio || "",
                precio: Number(boton.dataset.precio),
                imagen: boton.dataset.imagen || "",
            });
            // pequeño feedback visual
            const textoOriginal = boton.textContent;
            boton.textContent = "Agregado ✓";
            setTimeout(() => {
                boton.textContent = textoOriginal;
            }, 1200);
        });
    }
    // 5) Scroll infinito horizontal: cuando el usuario se acerca al final de la fila,
    //    pedimos la siguiente página de Discogs y la agregamos al final.
    function habilitarScrollInfinito(idContenedor, formato) {
        const contenedor = document.getElementById(idContenedor);
        if (!contenedor)
            return;
        contenedor.addEventListener("scroll", async () => {
            const cercaDelFinal = contenedor.scrollLeft + contenedor.clientWidth >=
                contenedor.scrollWidth - 300;
            const info = estado[formato];
            if (!cercaDelFinal || info.cargando || info.pagina >= info.totalPaginas)
                return;
            info.cargando = true;
            try {
                info.pagina += 1;
                const datos = await buscarPorFormato(formato, info.pagina);
                info.totalPaginas = datos.pagination.pages;
                pintarEnContenedor(idContenedor, datos.results, true);
            }
            catch (error) {
                console.error(error);
                info.pagina -= 1; // si falló, no contamos esa página como cargada
            }
            finally {
                info.cargando = false;
            }
        });
    }
    // 6) Flechas: mueven el scroll 300px hacia el lado que corresponda
    function habilitarFlechas(idContenedor, idFlechaIzq, idFlechaDer) {
        var _a, _b;
        const contenedor = document.getElementById(idContenedor);
        (_a = document.getElementById(idFlechaIzq)) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            contenedor === null || contenedor === void 0 ? void 0 : contenedor.scrollBy({ left: -300, behavior: "smooth" });
        });
        (_b = document.getElementById(idFlechaDer)) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
            contenedor === null || contenedor === void 0 ? void 0 : contenedor.scrollBy({ left: 300, behavior: "smooth" });
        });
    }
    async function iniciar() {
        try {
            const [vinilos, cassettes] = await Promise.all([
                buscarPorFormato("Vinyl", 1),
                buscarPorFormato("Cassette", 1),
            ]);
            estado.Vinyl.totalPaginas = vinilos.pagination.pages;
            estado.Cassette.totalPaginas = cassettes.pagination.pages;
            pintarEnContenedor("grid-vinilos", vinilos.results, false);
            pintarEnContenedor("grid-cassettes", cassettes.results, false);
            habilitarAgregarAlCarrito("grid-vinilos");
            habilitarAgregarAlCarrito("grid-cassettes");
            habilitarScrollInfinito("grid-vinilos", "Vinyl");
            habilitarScrollInfinito("grid-cassettes", "Cassette");
            habilitarFlechas("grid-vinilos", "flecha-izq-vinilos", "flecha-der-vinilos");
            habilitarFlechas("grid-cassettes", "flecha-izq-cassettes", "flecha-der-cassettes");
        }
        catch (error) {
            console.error(error);
            const mensaje = "<p>No se pudo cargar el catálogo.</p>";
            const g1 = document.getElementById("grid-vinilos");
            const g2 = document.getElementById("grid-cassettes");
            if (g1)
                g1.innerHTML = mensaje;
            if (g2)
                g2.innerHTML = mensaje;
        }
    }
    document.addEventListener("DOMContentLoaded", iniciar);
})();
