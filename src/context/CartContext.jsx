import { createContext, useContext, useEffect, useState } from "react";

// Contexto del carrito: guarda los productos agregados y el historial de
// compras. Ambos se persisten en localStorage para no perderlos al recargar.
const CartContext = createContext(null);
const CLAVE_CARRITO = "replay-carrito";
const CLAVE_HISTORIAL = "replay-historial";

// Lee el carrito guardado; si no existe o está dañado, empieza vacío.
function leerCarritoInicial() {
  const guardado = localStorage.getItem(CLAVE_CARRITO);
  if (!guardado) return [];
  try {
    return JSON.parse(guardado);
  } catch {
    return [];
  }
}

// Lee el historial de compras guardado; mismo manejo de errores que el carrito.
function leerHistorialInicial() {
  const guardado = localStorage.getItem(CLAVE_HISTORIAL);
  if (!guardado) return [];
  try {
    return JSON.parse(guardado);
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState(leerCarritoInicial);
  const [historial, setHistorial] = useState(leerHistorialInicial);

  // Guarda el carrito en localStorage cada vez que cambia.
  useEffect(() => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
  }, [carrito]);

  // Agrega un producto. Si ya estaba en el carrito, solo suma 1 a su cantidad.
  function agregar(nuevo) {
    setCarrito((prev) => {
      const existente = prev.find((item) => item.id === nuevo.id);
      if (existente) {
        return prev.map((item) =>
          item.id === nuevo.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        );
      }
      return [...prev, { ...nuevo, cantidad: 1 }];
    });
  }

  // Suma o resta unidades (delta = +1 / -1). Si la cantidad llega a 0,
  // el filter saca el producto del carrito.
  function cambiarCantidad(id, delta) {
    setCarrito((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, cantidad: item.cantidad + delta } : item,
        )
        .filter((item) => item.cantidad > 0),
    );
  }

  // Pasa todo el carrito al historial y lo vacía.
  // Devuelve false si no había nada que comprar.
  function finalizarCompra() {
    if (carrito.length === 0) return false;
    const historialActualizado = [...historial, ...carrito];
    localStorage.setItem(CLAVE_HISTORIAL, JSON.stringify(historialActualizado));
    setHistorial(historialActualizado);
    setCarrito([]);
    return true;
  }

  // Total de unidades (no de productos distintos); se muestra en el ícono del Header.
  const totalUnidades = carrito.reduce((suma, item) => suma + item.cantidad, 0);

  return (
    <CartContext.Provider
      value={{
        carrito,
        agregar,
        cambiarCantidad,
        finalizarCompra,
        totalUnidades,
        historial,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Atajo para usar el contexto: const { carrito, agregar } = useCart();
export function useCart() {
  return useContext(CartContext);
}
