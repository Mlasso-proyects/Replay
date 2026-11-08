// api/analizar.ts — responde en la ruta /api/analizar
// Instrucciones para el modelo (adáptalas a tu proyecto)
import { consultarIA, formatearIndicadores } from "./_adaptadores.js";
let indicadores: any; // antes del primer try
const INSTRUCCIONES = `Eres un analista de datos de Replay, una tienda de vinilos y cassettes.
Recibirás indicadores del registro de lanzamientos (discos disponibles, agotados y en preventa) entre las etiquetas <datos></datos>.
Los estados son: normal, requiere atención y crítico.
Responde en español y en máximo 4 frases:
1) resume el estado general, 2) señala el indicador que requiere más atención
y 3) sugiere una acción concreta para la tienda.
Usa SOLO la información de <datos>; no menciones datos que no aparezcan allí.`;
export default {
  async fetch(request: Request) {
    if (request.method !== "POST") {
      return Response.json({ error: "Método no permitido" }, { status: 405 });
    }
    // 1. Leer y validar lo que envía el navegador
    try {
      ({ indicadores } = await request.json());
    } catch {
      return Response.json(
        { error: "El cuerpo debe ser JSON" },
        { status: 400 },
      );
    }
    const valido =
      Array.isArray(indicadores) &&
      indicadores.length > 0 &&
      indicadores.length <= 30;
    if (!valido) {
      return Response.json(
        { error: "Envía entre 1 y 30 indicadores" },
        { status: 400 },
      );
    }
    // 2. Consultar al proveedor y devolver siempre el mismo formato: { texto }
    try {
      const datos = formatearIndicadores(indicadores);
      const texto = await consultarIA(INSTRUCCIONES, [
        { rol: "user", contenido: `<datos>\n${datos}\n</datos>` },
      ]);
      return Response.json({ texto });
    } catch (error) {
      // El detalle se ve en la terminal o en los logs de Vercel, NO en el navegador
      console.error(error);
      return Response.json(
        { error: "El servicio de IA no respondió" },
        { status: 502 },
      );
    }
  },
};
