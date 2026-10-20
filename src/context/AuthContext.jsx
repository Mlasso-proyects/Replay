import { createContext, useContext, useEffect, useState } from "react";

// Contexto de autenticación: guarda el usuario con sesión iniciada y expone
// funciones para registrarse, entrar y salir. Todo se guarda en localStorage
// (no hay backend), por lo que es una autenticación simulada.
const AuthContext = createContext(null);
const CLAVE_USUARIOS = "replay-usuarios"; // lista de cuentas registradas
const CLAVE_SESION = "replay-sesion"; // usuario con la sesión activa

// Devuelve las cuentas guardadas; si no hay o el JSON está dañado, una lista vacía.
function leerUsuarios() {
  const guardado = localStorage.getItem(CLAVE_USUARIOS);
  if (!guardado) return [];
  try {
    return JSON.parse(guardado);
  } catch {
    return [];
  }
}

// Recupera la sesión guardada para que el usuario siga logueado al recargar.
function leerSesionInicial() {
  const guardado = localStorage.getItem(CLAVE_SESION);
  if (!guardado) return null;
  try {
    return JSON.parse(guardado);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  // Se pasa la función (sin llamarla) para que solo se lea localStorage una vez.
  const [usuario, setUsuario] = useState(leerSesionInicial);

  // Sincroniza la sesión con localStorage cada vez que cambia el usuario.
  useEffect(() => {
    if (usuario) {
      localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario));
    } else {
      localStorage.removeItem(CLAVE_SESION);
    }
  }, [usuario]);

  // Crea una cuenta nueva (si el correo no está en uso) e inicia sesión con ella.
  // Devuelve { exito, mensaje } para que el formulario muestre el resultado.
  function registrar(nombre, correo, password) {
    const usuarios = leerUsuarios();
    const yaExiste = usuarios.some((u) => u.correo === correo);
    if (yaExiste)
      return { exito: false, mensaje: "Ya existe una cuenta con ese correo." };

    const nuevo = { nombre, correo, password };
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify([...usuarios, nuevo]));
    // En la sesión no se guarda la contraseña.
    setUsuario({ nombre, correo });
    return { exito: true };
  }

  // Busca una cuenta con ese correo y contraseña.
  function iniciarSesion(correo, password) {
    const usuarios = leerUsuarios();
    const encontrado = usuarios.find(
      (u) => u.correo === correo && u.password === password,
    );
    if (!encontrado)
      return { exito: false, mensaje: "Correo o contraseña incorrectos." };

    setUsuario({ nombre: encontrado.nombre, correo: encontrado.correo });
    return { exito: true };
  }

  // Al poner el usuario en null, el useEffect borra la sesión de localStorage.
  function cerrarSesion() {
    setUsuario(null);
  }

  return (
    <AuthContext.Provider
      value={{ usuario, registrar, iniciarSesion, cerrarSesion }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Atajo para usar el contexto: const { usuario } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}
