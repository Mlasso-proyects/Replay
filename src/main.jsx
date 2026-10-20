import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "../css/styles.css";

// Punto de entrada: monta la app en el <div id="root"> de index.html.
// Los providers envuelven a <App /> para que cualquier componente pueda
// acceder a la sesión (useAuth) y al carrito (useCart).
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>,
);
