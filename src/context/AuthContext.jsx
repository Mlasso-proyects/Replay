import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const CLAVE_USUARIOS = "replay-usuarios";
const CLAVE_SESION = "replay-sesion";

function leerUsuarios() {
  const guardado = localStorage.getItem(CLAVE_USUARIOS);
  if (!guardado) return [];
  try {
    return JSON.parse(guardado);
  } catch {
    return [];
  }
}

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
  const [usuario, setUsuario] = useState(leerSesionInicial);

  useEffect(() => {
    if (usuario) {
      localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario));
    } else {
      localStorage.removeItem(CLAVE_SESION);
    }
  }, [usuario]);

  function registrar(nombre, correo, password) {
    const usuarios = leerUsuarios();
    const yaExiste = usuarios.some((u) => u.correo === correo);
    if (yaExiste)
      return { exito: false, mensaje: "Ya existe una cuenta con ese correo." };

    const nuevo = { nombre, correo, password };
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify([...usuarios, nuevo]));
    setUsuario({ nombre, correo });
    return { exito: true };
  }

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

export function useAuth() {
  return useContext(AuthContext);
}
