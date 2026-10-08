import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const CLAVE_CARRITO = "replay-carrito";
const CLAVE_HISTORIAL = "replay-historial";

function leerCarritoInicial() {
  const guardado = localStorage.getItem(CLAVE_CARRITO);
  if (!guardado) return [];
  try {
    return JSON.parse(guardado);
  } catch {
    return [];
  }
}

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

  useEffect(() => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
  }, [carrito]);

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

  function cambiarCantidad(id, delta) {
    setCarrito((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, cantidad: item.cantidad + delta } : item,
        )
        .filter((item) => item.cantidad > 0),
    );
  }

  function finalizarCompra() {
    if (carrito.length === 0) return false;
    const historialActualizado = [...historial, ...carrito];
    localStorage.setItem(CLAVE_HISTORIAL, JSON.stringify(historialActualizado));
    setHistorial(historialActualizado);
    setCarrito([]);
    return true;
  }

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

export function useCart() {
  return useContext(CartContext);
}
