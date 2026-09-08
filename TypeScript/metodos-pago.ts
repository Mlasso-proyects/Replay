// ==========================================================
// metodos-pago.ts
// Al hacer clic en "Continuar", simulamos el pago: movemos
// el contenido del carrito al historial y avisamos al usuario.
// ==========================================================

(function () {
  const botonContinuar = document.getElementById("btn-continuar");

  botonContinuar?.addEventListener("click", (evento) => {
    evento.preventDefault(); // el botón no tiene funcionalidad real de envío de formulario

    // Llamamos a la función que expusimos en carrito.ts
    const exito = (window as any).ReplayCarrito.finalizarCompra();

    if (!exito) {
      alert("Tu carrito está vacío. Agrega algún producto antes de continuar.");
      return;
    }

    alert("¡Compra realizada con éxito! La agregamos a tu historial.");
    window.location.href = "historial.html"; // lo llevamos a ver su compra reciente
  });
})();
