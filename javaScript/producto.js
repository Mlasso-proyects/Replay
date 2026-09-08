"use strict";
// ==========================================================
// producto.ts
// Muestra el detalle de UN release de Discogs, según el id
// que llega por la URL: producto.html?id=249504
// ==========================================================
(function () {
    const TOKEN_DISCOGS = "YPVKoYeIGXXpUohUUaIcKDBDbZMQilXuFPkbqoyt"; // el mismo token de productos.ts
    const USER_AGENT = "ReplayTiendaVinilos/1.0";
    const contenedorDetalle = document.querySelector(".detalle-personaje");
    function obtenerIdDesdeURL() {
        const parametros = new URLSearchParams(window.location.search);
        return parametros.get("id");
    }
    async function obtenerReleasePorId(id) {
        const url = `https://api.discogs.com/releases/${id}?token=${TOKEN_DISCOGS}`;
        const respuesta = await fetch(url, {
            headers: { "User-Agent": USER_AGENT },
        });
        if (!respuesta.ok) {
            throw new Error("No se encontró ese producto en Discogs");
        }
        return await respuesta.json();
    }
    function mostrarRelease(release) {
        var _a, _b;
        // el arreglo "artists" puede traer varios; los unimos con coma
        const artistas = release.artists.map((a) => a.name).join(", ");
        const imagen = release.images && release.images.length > 0 ? release.images[0].uri : "";
        const formato = release.formats && release.formats.length > 0
            ? release.formats[0].name
            : "Formato desconocido";
        contenedorDetalle.innerHTML = `
    <img src="${imagen}" alt="Portada de ${release.title}" class="detalle-imagen">
    <h1>${release.title}</h1>
    <p><strong>Artista:</strong> ${artistas}</p>
    <p><strong>Año:</strong> ${release.year}</p>
    <p><strong>Formato:</strong> ${formato}</p>
    <p><strong>Género:</strong> ${((_a = release.genres) === null || _a === void 0 ? void 0 : _a.join(", ")) || "No especificado"}</p>
    <p><strong>País de edición:</strong> ${release.country}</p>
    <p class="lede">Envío disponible a todo el país.</p>
    <button
    class="btn-outline btn-agregar-detalle"
    id="btn-agregar-detalle"
    >Agregar al carrito</button>
    <a href="productos.html" class="btn-outline">← Volver al catálogo</a>
  `;
        // Conectamos el botón recién creado con el carrito compartido
        (_b = document
            .getElementById("btn-agregar-detalle")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
            window.ReplayCarrito.agregar({
                id: release.id,
                titulo: release.title,
                artista: artistas,
                anio: String(release.year),
                precio: 60000 + (release.id % 40) * 1000, // mismo cálculo que en productos.ts
                imagen,
            });
        });
    }
    async function iniciarDetalle() {
        if (!contenedorDetalle)
            return;
        const id = obtenerIdDesdeURL();
        if (!id) {
            contenedorDetalle.innerHTML = "<p>No se especificó ningún producto.</p>";
            return;
        }
        try {
            contenedorDetalle.innerHTML = "<p>Cargando...</p>";
            const release = await obtenerReleasePorId(id);
            mostrarRelease(release);
        }
        catch (error) {
            contenedorDetalle.innerHTML = "<p>No se pudo cargar el producto.</p>";
            console.error(error);
        }
    }
    document.addEventListener("DOMContentLoaded", iniciarDetalle);
})();
