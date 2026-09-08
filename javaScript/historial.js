"use strict";
// ==========================================================
// historial.ts
// Lee las compras ya finalizadas (guardadas por metodos-pago.ts)
// y las dibuja en historial.html
// ==========================================================
(function () {
    const CLAVE_HISTORIAL = "replay-historial"; // misma clave usada en carrito.ts
    function leerHistorial() {
        const guardado = localStorage.getItem(CLAVE_HISTORIAL);
        if (!guardado)
            return [];
        try {
            return JSON.parse(guardado);
        }
        catch (_a) {
            return [];
        }
    }
    function formatearPrecio(valor) {
        return `COP $${valor.toLocaleString("es-CO")}`;
    }
    function mostrarHistorial() {
        const contenedor = document.getElementById("historial-items");
        if (!contenedor)
            return;
        const compras = leerHistorial();
        contenedor.innerHTML =
            compras.length === 0
                ? "<p>Aún no has realizado ninguna compra.</p>"
                : compras
                    .map((item) => `
        <div class="line-item">
          <div class="thumb" style="background-image:url('${item.imagen}');background-size:cover;background-position:center;"></div>
          <div class="info">
            <p class="name">${item.titulo.toUpperCase()}</p>
            <p class="artist">${item.artista} · ${item.anio}${item.cantidad > 1 ? " · " + item.cantidad + " und" : ""}</p>
          </div>
          <div class="price-col"><span class="price">${formatearPrecio(item.precio * item.cantidad)}</span></div>
        </div>
      `)
                    .join("");
    }
    document.addEventListener("DOMContentLoaded", mostrarHistorial);
})();
