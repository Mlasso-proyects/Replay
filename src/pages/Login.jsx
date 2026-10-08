import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Login() {
  const { iniciarSesion, registrar } = useAuth();
  const navigate = useNavigate();
  const [modo, setModo] = useState("ingresar"); // 'ingresar' | 'registrar'

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function alEnviar(e) {
    e.preventDefault();
    setError("");

    const resultado =
      modo === "ingresar"
        ? iniciarSesion(correo, password)
        : registrar(nombre, correo, password);

    if (!resultado.exito) {
      setError(resultado.mensaje);
      return;
    }
    navigate("/perfil");
  }

  return (
    <main className="page">
      <section className="page-hero">
        <div className="container">
          <h1>{modo === "ingresar" ? "INICIAR SESIÓN" : "CREAR CUENTA"}</h1>
          <p className="lede">
            {modo === "ingresar"
              ? "Ingresa con tu correo y contraseña."
              : "Regístrate para guardar tu carrito e historial."}
          </p>
        </div>
      </section>

      <section className="section container" style={{ maxWidth: "480px" }}>
        <form className="form-card" onSubmit={alEnviar}>
          {modo === "registrar" && (
            <div className="field">
              <label htmlFor="nombre">Nombre completo</label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
          )}

          <div className="field">
            <label htmlFor="correo">Correo electrónico</label>
            <input
              id="correo"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p style={{ color: "var(--clay)" }}>{error}</p>}

          <div className="form-actions">
            <button type="submit" className="btn-solid">
              {modo === "ingresar" ? "Ingresar" : "Crear cuenta"}
            </button>
          </div>
        </form>

        <p style={{ textAlign: "center", marginTop: "16px" }}>
          {modo === "ingresar" ? (
            <>
              ¿No tienes cuenta?{" "}
              <button
                className="link-button"
                onClick={() => setModo("registrar")}
              >
                Regístrate
              </button>
            </>
          ) : (
            <>
              ¿Ya tienes cuenta?{" "}
              <button
                className="link-button"
                onClick={() => setModo("ingresar")}
              >
                Inicia sesión
              </button>
            </>
          )}
        </p>
      </section>
    </main>
  );
}

export default Login;
