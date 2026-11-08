// src/componentes/PanelIA.tsx
import { useState } from "react";
import type { Indicator } from "../types/index";
import { analizarIndicadores } from "../services/ia";
import styles from "./PanelIA.module.css";
interface PanelIAProps {
  indicadores: Indicator[]; // los mismos indicadores que muestra el dashboard
}
export const PanelIA = ({ indicadores }: PanelIAProps) => {
  const [analisis, setAnalisis] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const analizar = async () => {
    setCargando(true);
    setError(null);
    try {
      const texto = await analizarIndicadores(
        indicadores,
        AbortSignal.timeout(30_000),
      );
      setAnalisis(texto);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado");
    } finally {
      setCargando(false); // se ejecuta siempre, con éxito o con error
    }
  };
  return (
    <section className={styles.panel} aria-labelledby="titulo-ia">
      <div className={styles.cabecera}>
        <h2 id="titulo-ia" className={styles.titulo}>
          Analista IA (Unidad 3 · Tema 2)
        </h2>
        <button
          className={styles.boton}
          onClick={analizar}
          disabled={cargando || indicadores.length === 0}
        >
          {cargando ? "Analizando…" : "Analizar indicadores con IA"}
        </button>
      </div>
      {/* Renderizado condicional de los tres estados */}
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
      {analisis && !error && (
        <div aria-live="polite">
          <p className={styles.texto}>{analisis}</p>
          <small className={styles.aviso}>
            Generado por IA ({indicadores.length} indicadores) · verifica antes
            de decidir.
          </small>
        </div>
      )}
      {!analisis && !error && !cargando && (
        <p className={styles.vacio}>Pulsa el botón para obtener un resumen.</p>
      )}
    </section>
  );
};
