/// <reference types="node" />
// api/_adaptadores.ts — se ejecuta en el SERVIDOR de Vercel, nunca en el navegador
import { readFileSync } from "node:fs";
import { join } from "node:path";

export type MensajeIA = { rol: "user" | "assistant"; contenido: string };

// Solo en local: si vercel dev no entrega las variables, se leen de .env.local
function leerEnvLocal() {
  for (const archivo of [".env.local", ".vercel/.env.development.local"]) {
    try {
      const texto = readFileSync(join(process.cwd(), archivo), "utf8");
      for (const linea of texto.split(/\r?\n/)) {
        const i = linea.indexOf("=");
        if (i <= 0 || linea.trim().startsWith("#")) continue;
        const nombre = linea.slice(0, i).trim();
        const valor = linea
          .slice(i + 1)
          .trim()
          .replace(/^"(.*)"$/, "$1");
        if (!process.env[nombre]) process.env[nombre] = valor;
      }
    } catch {
      // si el archivo no existe, se prueba el siguiente
    }
  }
}
// Convierte la lista de indicadores en texto plano para incluirlo en el prompt
export function formatearIndicadores(indicadores: any[]): string {
  return indicadores
    .slice(0, 30) // como máximo 30 indicadores
    .map(
      (i) =>
        `- ${String(i.metric).slice(0, 60)}: ${String(i.value).slice(0, 20)}` +
        ` (estado: ${String(i.status).slice(0, 15)})`,
    )
    .join("\n");
}
// Envía las instrucciones y los mensajes al proveedor elegido y devuelve SOLO el texto
export async function consultarIA(
  instrucciones: string,
  mensajes: MensajeIA[],
): Promise<string> {
  if (!process.env.IA_API_KEY) leerEnvLocal();
  const PROVEEDOR = process.env.PROVEEDOR ?? "gemini";
  const CLAVE = process.env.IA_API_KEY;
  const MODELO = process.env.IA_MODELO;
  if (!CLAVE || !MODELO)
    throw new Error(
      `Faltan variables -> IA_API_KEY: ${CLAVE ? "ok" : "FALTA"}, IA_MODELO: ${MODELO ? "ok" : "FALTA"}, PROVEEDOR: ${PROVEEDOR}`,
    );
  // ---------- OpenAI (Responses API) ----------
  if (PROVEEDOR === "openai") {
    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CLAVE}`,
      },
      body: JSON.stringify({
        model: MODELO,
        instructions: instrucciones,
        input: mensajes.map((m) => ({ role: m.rol, content: m.contenido })),
      }),
    });
    if (!r.ok)
      throw new Error(`OpenAI respondió ${r.status}: ${await r.text()}`);
    const datos = await r.json();
    // El texto está en output → message → content → output_text
    return (datos.output ?? [])
      .filter((item: any) => item.type === "message")
      .flatMap((item: any) => item.content)
      .filter((parte: any) => parte.type === "output_text")
      .map((parte: any) => parte.text)
      .join("");
  }
  // ---------- Google (Gemini API) ----------
  if (PROVEEDOR === "gemini") {
    const base = "https://generativelanguage.googleapis.com/v1beta/models";
    const url = `${base}/${MODELO}:generateContent`;
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": CLAVE },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: instrucciones }] },
        contents: mensajes.map((m) => ({
          // Gemini llama 'model' al asistente
          role: m.rol === "assistant" ? "model" : "user",
          parts: [{ text: m.contenido }],
        })),
      }),
    });
    if (!r.ok)
      throw new Error(`Gemini respondió ${r.status}: ${await r.text()}`);
    const datos = await r.json();
    // El texto está en candidates[0].content.parts
    return (
      datos.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("") ??
      ""
    );
  }
  // ---------- Hugging Face (formato Chat Completions) ----------
  const r = await fetch("https://router.huggingface.co/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CLAVE}`,
    },
    body: JSON.stringify({
      model: MODELO,
      messages: [
        { role: "system", content: instrucciones },
        ...mensajes.map((m) => ({ role: m.rol, content: m.contenido })),
      ],
    }),
  });
  if (!r.ok)
    throw new Error(`Hugging Face respondió ${r.status}: ${await r.text()}`);
  const datos = await r.json();
  // El texto está en choices[0].message.content
  return datos.choices?.[0]?.message?.content ?? "";
}
