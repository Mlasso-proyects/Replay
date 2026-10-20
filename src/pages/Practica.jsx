import { useEffect, useState } from "react";
import FormularioLanzamiento from "../components/FormularioLanzamiento.jsx";

// Página de práctica de los Temas 3 y 4: formulario controlado, lista de
// lanzamientos y consumo de una API externa (Fake Store API).
function Practica() {
  // Tema 4: estado de la lista con datos iniciales de la tienda.
  const [lanzamientos, setLanzamientos] = useState([
    { id: 1, album: "Abbey Road", artista: "The Beatles", estado: "Disponible" },
    { id: 2, album: "Rumours", artista: "Fleetwood Mac", estado: "Agotado" },
    { id: 3, album: "Thriller", artista: "Michael Jackson", estado: "Disponible" },
    { id: 4, album: "Random Access Memories", artista: "Daft Punk", estado: "Preventa" },
  ]);

  // Tema 4: estado de carga (true mientras se espera la respuesta de la API).
  const [cargandoApi, setCargandoApi] = useState(false);
  // Tema 4: estado de error (null si no hay error, o el mensaje a mostrar).
  const [errorApi, setErrorApi] = useState(null);

  // Tema 4: useEffect con arreglo de dependencias vacío [].
  // El [] hace que el efecto se ejecute una sola vez, cuando el componente se monta.
  useEffect(() => {
    console.log("Componente montado: listo para peticiones HTTP.");
  }, []);

  // Tema 3: recibe el lanzamiento del formulario y lo agrega al inicio de la lista.
  function agregarLanzamiento(nuevo) {
    setLanzamientos((prev) => [nuevo, ...prev]);
  }

  // Tema 4: función asíncrona que consume la API externa con fetch.
  async function consumirApiExterna() {
    // Tema 4: se activa la carga y se borra cualquier error anterior.
    setCargandoApi(true);
    setErrorApi(null);

    // Tema 4: manejo de errores con try/catch.
    try {
      // Se pide un producto al azar (la API tiene ids del 1 al 20).
      const idAleatorio = Math.floor(Math.random() * 20) + 1;
      const respuesta = await fetch(
        `https://fakestoreapi.com/products/${idAleatorio}`,
      );

      // Tema 4: si la respuesta no es correcta (status 200-299) se lanza un error.
      if (!respuesta.ok) {
        throw new Error(`Error HTTP: ${respuesta.status}`);
      }

      // Tema 4: se convierte la respuesta a JSON.
      const datos = await respuesta.json();

      // Tema 4: se transforman los datos de la API al formato de nuestra lista.
      const nuevo = {
        id: Date.now(),
        album: datos.title,
        artista: `Fake Store · ${datos.category}`,
        estado: "Disponible",
      };

      // Tema 4: se agrega el nuevo elemento al inicio usando el estado anterior.
      setLanzamientos((prev) => [nuevo, ...prev]);
    } catch {
      setErrorApi("No se pudo conectar con la API externa. Verifique su red.");
    } finally {
      // Tema 4: finally apaga la carga pase lo que pase (éxito o error).
      setCargandoApi(false);
    }
  }

  return (
    <main className="page">
      <section className="page-hero">
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <h1>LANZAMIENTOS REPLAY</h1>
            <p className="lede">Registro de vinilos y cassettes de la tienda.</p>
          </div>
          {/* Tema 4: evento onClick; el botón se deshabilita mientras carga */}
          <button
            className="btn-solid"
            onClick={consumirApiExterna}
            disabled={cargandoApi}
          >
            {/* Tema 4: renderizado condicional con operador ternario */}
            {cargandoApi ? "Consultando API..." : "Consumir API Real"}
          </button>
        </div>
      </section>

      <section className="section container" style={{ maxWidth: "760px" }}>
        {/* Tema 4: renderizado condicional con &&: solo se muestra si hay error */}
        {errorApi && (
          <div
            style={{
              background: "#fde2e1",
              color: "#8a1c1c",
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            {errorApi}
          </div>
        )}

        {/* Tema 3: se pasa la función agregarLanzamiento como prop al formulario */}
        <FormularioLanzamiento onAgregarLanzamiento={agregarLanzamiento} />

        <p className="section-tab" style={{ marginTop: "32px" }}>
          Lanzamientos registrados: {lanzamientos.length}
        </p>

        <div style={{ display: "grid", gap: "12px" }}>
          {/* Tema 3: renderizado de listas con .map() y key */}
          {lanzamientos.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
                padding: "14px 18px",
                border: "1.5px solid var(--ink)",
                borderRadius: "10px",
              }}
            >
              <div>
                <p style={{ margin: 0, fontWeight: 700 }}>
                  {item.album.toUpperCase()}
                </p>
                <p style={{ margin: "4px 0 0", color: "var(--ink-soft)" }}>
                  {item.artista}
                </p>
              </div>
              {/* Tema 4: el color de la etiqueta cambia con un ternario según el estado */}
              <span
                style={{
                  padding: "4px 10px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                  background:
                    item.estado === "Disponible"
                      ? "#d9f0dc"
                      : item.estado === "Agotado"
                        ? "#fde2e1"
                        : "#fff1c9",
                }}
              >
                {item.estado}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Practica;
