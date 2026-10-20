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
// Temas 3 y 4: página de práctica (formulario controlado y consumo de API).
import Practica from "./pages/Practica.jsx";

// Componente raíz: define las rutas de la tienda.
// Header y Footer quedan fuera de <Routes> para mostrarse en todas las páginas.
function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* :id es un parámetro dinámico que ProductoDetalle lee con useParams */}
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
        <Route path="/practica" element={<Practica />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
