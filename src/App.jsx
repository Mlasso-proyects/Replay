import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Inicio from "./pages/Inicio.jsx";
import Productos from "./pages/Productos.jsx";
import ProductoDetalle from "./pages/ProductoDetalle.jsx";
import Carrito from "./pages/Carrito.jsx";
import MetodosPago from "./pages/MetodosPago.jsx";
import Historial from "./pages/Historial.jsx";
import Buscar from "./pages/Buscar.jsx";
import Perfil from "./pages/Perfil.jsx";
import Nosotros from "./pages/Nosotros.jsx";
import Configuracion from "./pages/Configuracion.jsx";
import Login from "./pages/Login.jsx";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/producto/:id" element={<ProductoDetalle />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/metodos-pago" element={<MetodosPago />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/buscar" element={<Buscar />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/configuracion" element={<Configuracion />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
