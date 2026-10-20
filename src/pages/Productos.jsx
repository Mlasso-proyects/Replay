import FilaProductos from "../components/FilaProductos.jsx";
import FormularioDisco from "../components/FormularioDisco.jsx";

// Catálogo completo: filas de vinilos y cassettes, y el formulario para pedir un disco.
function Productos() {
  return (
    <main className="page">
      <section className="section container">
        <p className="section-tab">Vinilos</p>
        <FilaProductos formato="Vinyl" />

        <p className="section-tab" style={{ marginTop: "32px" }}>
          Cassettes
        </p>
        <FilaProductos formato="Cassette" />

        <FormularioDisco />
      </section>
    </main>
  );
}

export default Productos;
