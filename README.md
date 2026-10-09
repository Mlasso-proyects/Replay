# Replay

Tienda web de vinilos y cassettes hecha con **React** y **Vite**. El catálogo, la búsqueda y el detalle de cada disco se obtienen en tiempo real desde la API de [Discogs](https://www.discogs.com/developers).

**Demo:** _(pega aquí la URL de Vercel cuando despliegues, en el Paso 9)_

## Funcionalidades

- Catálogo de vinilos y cassettes con scroll infinito (consumo de API con `fetch`).
- Búsqueda por artista o álbum con retardo (debounce) de 400 ms.
- Página de detalle de cada disco.
- Carrito de compras e historial, guardados en `localStorage`.
- Registro e inicio de sesión de usuarios (simulado en el navegador).
- Formulario controlado para pedir un disco que no está en el catálogo.
- Estados de carga y manejo de errores en todas las peticiones.

## Tecnologías

- React 19
- React Router 7
- Vite
- API de Discogs

## Requisitos

- [Node.js](https://nodejs.org/) 18 o superior
- Un token personal de Discogs (Discogs → Settings → Developers → Generate new token)

## Instalación y uso

1. Clona el repositorio:

```bash
   git clone https://github.com/Mlasso-proyects/Replay.git
   cd Replay
```

2. Instala las dependencias:

```bash
   npm install
```

3. Crea un archivo `.env` en la raíz del proyecto con tu token:

```
   VITE_DISCOGS_TOKEN=tu_token_de_discogs
```

4. Inicia el servidor de desarrollo:

```bash
   npm run dev
```

## Scripts

| Comando           | Descripción                                     |
| ----------------- | ----------------------------------------------- |
| `npm run dev`     | Servidor de desarrollo                          |
| `npm run build`   | Compilación de producción en la carpeta `dist/` |
| `npm run preview` | Vista previa local de la compilación            |

## Estructura del proyecto

```
src/
├── components/   Componentes reutilizables (Header, Footer, filas, formulario)
├── context/      Estado global: carrito y autenticación
├── hooks/        Hooks personalizados (catálogo de Discogs)
├── pages/        Páginas de la aplicación
├── services/     Llamadas a la API de Discogs
└── utils/        Funciones auxiliares de formato
```

## Despliegue

El proyecto se despliega en [Vercel](https://vercel.com). El archivo `vercel.json` redirige todas las rutas a `index.html` para que React Router funcione al recargar la página. La variable `VITE_DISCOGS_TOKEN` se configura en Vercel, en Settings → Environment Variables.
