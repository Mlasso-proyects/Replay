import FilaProductos from "../components/FilaProductos.jsx";

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
      </section>
    </main>
  );
}

export default Productos;
