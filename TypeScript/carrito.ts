// ==========================================================
// carrito.ts
// Lógica del carrito de compras, compartida entre TODAS las
// páginas. Usa localStorage: el carrito sobrevive a recargar
// la página o navegar a otra, porque queda guardado en el navegador.
// ==========================================================

(function () {
  // 1) Forma de un producto ya dentro del carrito
  interface ItemCarrito {
    id: number;
    titulo: string;
    artista: string;
    anio: string;
    precio: number; // precio unitario, como número (para poder sumar)
    imagen: string;
    cantidad: number;
  }

  // 2) Clave fija con la que guardamos el carrito en localStorage
  const CLAVE_CARRITO = "replay-carrito";

  // 3) Lee el carrito guardado. Si no hay nada aún, devuelve un arreglo vacío.
  function leerCarrito(): ItemCarrito[] {
    const guardado = localStorage.getItem(CLAVE_CARRITO);
    if (!guardado) return [];
    try {
      return JSON.parse(guardado) as ItemCarrito[];
    } catch {
      return []; // si el contenido está corrupto, empezamos de cero
    }
  }

  // 4) Guarda el carrito completo en localStorage (como texto JSON)
  function guardarCarrito(carrito: ItemCarrito[]): void {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    actualizarBadge();
  }

  // 5) Agrega un producto. Si ya existía, solo le suma 1 a la cantidad.
  function agregarAlCarrito(nuevo: Omit<ItemCarrito, "cantidad">): void {
    const carrito = leerCarrito();
    const existente = carrito.find((item) => item.id === nuevo.id);

    if (existente) {
      existente.cantidad += 1;
    } else {
      carrito.push({ ...nuevo, cantidad: 1 });
    }

    guardarCarrito(carrito);
  }

  // 6) Suma o resta unidades de un producto. Si llega a 0, lo elimina.
  function cambiarCantidad(id: number, delta: number): void {
    let carrito = leerCarrito();
    const item = carrito.find((p) => p.id === id);
    if (!item) return;

    item.cantidad += delta;
    if (item.cantidad <= 0) {
      carrito = carrito.filter((p) => p.id !== id);
    }

    guardarCarrito(carrito);
    pintarCarritoSiExiste();
  }

  // 7) Actualiza el numerito rojo sobre el ícono del carrito, en cualquier página
  function actualizarBadge(): void {
    const totalUnidades = leerCarrito().reduce(
      (suma, item) => suma + item.cantidad,
      0,
    );
    document.querySelectorAll(".icon-link .badge").forEach((el) => {
      el.textContent = String(totalUnidades);
    });
  }

  // 8) Formatea un número como pesos colombianos: 85000 -> "COP $85.000"
  function formatearPrecio(valor: number): string {
    return `COP $${valor.toLocaleString("es-CO")}`;
  }

  // 9) Dibuja los productos del carrito DENTRO de carrito.html (si estamos ahí)
  function pintarCarritoSiExiste(): void {
    const contenedorItems = document.getElementById("carrito-items");
    if (!contenedorItems) return; // no estamos en carrito.html

    const carrito = leerCarrito();

    contenedorItems.innerHTML =
      carrito.length === 0
        ? "<p>Tu carrito está vacío.</p>"
        : carrito
            .map(
              (item) => `
        <div class="line-item">
          <div class="thumb" style="background-image:url('${item.imagen}');background-size:cover;background-position:center;"></div>
          <div class="info">
            <p class="name">${item.titulo.toUpperCase()}</p>
            <p class="artist">${item.artista} · ${item.anio}</p>
          </div>
          <div class="price-col">
            <span class="price">${formatearPrecio(item.precio * item.cantidad)}</span>
            <div class="qty-stepper">
              <button class="step" data-accion="sumar" data-id="${item.id}">+</button>
              <span class="n">${item.cantidad} UND</span>
              <button class="step" data-accion="restar" data-id="${item.id}">–</button>
            </div>
          </div>
        </div>
      `,
            )
            .join("");

    // 10) Subtotal, envío fijo (12.000) y total
    const subtotal = carrito.reduce(
      (suma, item) => suma + item.precio * item.cantidad,
      0,
    );
    const envio = carrito.length > 0 ? 12000 : 0;
    const total = subtotal + envio;

    const elSubtotal = document.getElementById("resumen-subtotal");
    const elEnvio = document.getElementById("resumen-envio");
    const elTotal = document.getElementById("resumen-total");
    if (elSubtotal) elSubtotal.textContent = formatearPrecio(subtotal);
    if (elEnvio) elEnvio.textContent = formatearPrecio(envio);
    if (elTotal) elTotal.textContent = formatearPrecio(total);

    // 11) Conectamos los botones "+" y "–" que se acaban de crear
    contenedorItems.querySelectorAll("button[data-accion]").forEach((boton) => {
      boton.addEventListener("click", () => {
        const id = Number(boton.getAttribute("data-id"));
        const accion = boton.getAttribute("data-accion");
        cambiarCantidad(id, accion === "sumar" ? 1 : -1);
      });
    });
  }

  // 12) Exponemos las funciones que productos.ts y producto.ts necesitan usar,
  //     colgándolas del objeto global "window" (así se comunican entre archivos).
  (window as any).ReplayCarrito = {
    agregar: agregarAlCarrito,
    finalizarCompra: finalizarCompra,
  };

  // 13) Al cargar cualquier página: actualizamos el número del carrito,
  //     y si estamos en carrito.html, también dibujamos la lista completa.
  document.addEventListener("DOMContentLoaded", () => {
    actualizarBadge();
    pintarCarritoSiExiste();
  });
  // 14) Clave con la que guardamos el HISTORIAL (compras ya finalizadas)
  const CLAVE_HISTORIAL = "replay-historial";

  // 15) Lee las compras ya realizadas (separado del carrito activo)
  function leerHistorial(): ItemCarrito[] {
    const guardado = localStorage.getItem(CLAVE_HISTORIAL);
    if (!guardado) return [];
    try {
      return JSON.parse(guardado) as ItemCarrito[];
    } catch {
      return [];
    }
  }

  // 16) Mueve TODO lo que hay en el carrito hacia el historial, y vacía el carrito.
  //     Devuelve "false" si el carrito ya estaba vacío (no hay nada que finalizar).
  function finalizarCompra(): boolean {
    const carrito = leerCarrito();
    if (carrito.length === 0) return false;

    const historialActual = leerHistorial();
    const historialActualizado = [...historialActual, ...carrito]; // agregamos las compras nuevas al final

    localStorage.setItem(CLAVE_HISTORIAL, JSON.stringify(historialActualizado));
    localStorage.removeItem(CLAVE_CARRITO); // vaciamos el carrito, ya se "compró"
    actualizarBadge();

    return true;
  }
})();
