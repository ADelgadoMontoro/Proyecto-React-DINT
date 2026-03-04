# Proyecto React - Videojuegos V2 (JWT + CRUD + Asistente IA)

Aplicacion completa con frontend en React y backend propio con autenticacion JWT y roles (`user`, `admin`).

## Stack elegido (y por que)

- Frontend: React + Vite + React Router + Axios + Material UI.
- Backend: Node.js + Express.
- Persistencia: almacenamiento persistente en JSON (`backend/data/db.json`).
- Auth: JWT + `bcryptjs` para hash de contraseñas.
- IA local: Ollama con modelo `lfm2.5-thinking:1.2b`.
- Docker: frontend + backend + ollama con `docker-compose`.

Justificacion corta:
- Es un stack rapido de montar para una V2 de clase.
- Mantiene codigo simple para alguien que esta aprendiendo.
- Permite cubrir JWT, roles, rutas protegidas y CRUD completo sin complejidad extra.

## Refactor UI (Material UI)

He elegido **Material UI (MUI)** y los componentes que voy a refactorizar manualmente son:

1. `src/components/Layout.jsx`
- Cambiar la cabecera a componentes MUI (`AppBar`, `Toolbar`, `Button`, `Chip`, `Container`).
- Mantener la navegacion con `react-router-dom` usando botones/enlaces de MUI.

2. `src/pages/LoginPage.jsx`
- Refactorizar el formulario con `Paper`, `Stack`, `TextField`, `Button`, `Alert`.
- Mejorar la presentacion de estados de carga y error en el login.

3. `src/pages/NewGamePage.jsx`
- Rehacer el alta con `Paper`, `Grid`, `TextField`, `Button`, `Alert`.
- Mejorar distribucion y legibilidad del formulario en desktop y movil.

El resto de componentes los adapta la IA.

## Estructura

- `src/`: frontend React
- `backend/`: API JWT + CRUD + endpoint de asistente IA
- `backend/data/db.json`: datos persistentes de usuarios y videojuegos
- `docker-compose.yml`: arranque de frontend, backend y ollama

## Instalacion local

### Frontend

```bash
npm install
```

### Backend

```bash
npm install --prefix backend
```

## Variables de entorno

### Frontend

Copia `.env.example` a `.env`:

```env
VITE_API_URL=http://localhost:8787
```

### Backend

Copia `backend/.env.example` a `backend/.env` (si lo usas en tu entorno):

```env
BACKEND_PORT=8787
JWT_SECRET=change_this_secret_in_production
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=lfm2.5-thinking:1.2b
```

## Ejecucion local

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8787`

Tambien puedes ejecutar por separado:

```bash
npm run dev:client
npm run dev:api
```

## Usuarios de prueba iniciales

Se guardan en `backend/data/db.json`:

- `admin` / `admin123` (`role`: `admin`)
- `Adrian` / `admin123` (`role`: `user`)
- `Luis` / `admin123` (`role`: `user`)
- `Marquez` / `admin123` (`role`: `user`)

## Endpoints principales (backend)

Base URL: `http://localhost:8787`

### Auth

- `POST /auth/register`
  - body:
    ```json
    { "username": "pepe", "email": "pepe@mail.com", "password": "123456" }
    ```
- `POST /auth/login`
  - body:
    ```json
    { "username": "pepe", "password": "123456" }
    ```
  - response:
    ```json
    { "token": "...", "user": { "id": 2, "username": "pepe", "email": "pepe@mail.com", "role": "user" } }
    ```

### Videojuegos (protegidos, requieren `Authorization: Bearer <token>`)

- `GET /videojuegos?page=1&limit=10`
  - Devuelve videojuegos de todos los usuarios + `usuario` (nombre del creador).
- `GET /videojuegos/mios?page=1&limit=10`
  - Devuelve videojuegos del usuario autenticado.
- `GET /videojuegos/:id`
- `POST /videojuegos`
- `DELETE /videojuegos/:id`
  - `user`: solo elimina los suyos.
  - `admin`: puede eliminar cualquiera.

### IA (protegido)

- `POST /assistant/chat`
  - body:
    ```json
    { "message": "Recomiendame un juego de motos para PC" }
    ```
  - response:
    ```json
    { "reply": "..." }
    ```

## Asistente IA (frontend)

- Aparece con un boton flotante abajo a la derecha.
- Al abrirlo, muestra un chat simple para preguntar por videojuegos.
- Usa el endpoint `/assistant/chat` del backend.

Instrucciones de comportamiento definidas en backend:
- Solo responder con videojuegos que existan en la base de datos actual.
- No inventar juegos ni datos fuera de esa base.
- Si la pregunta no aplica a los juegos guardados, responderlo claramente.
- Puede recomendar comparando categoria, plataforma, precio y popularidad.

## Docker

### Levantar todo

```bash
docker compose up --build -d
```

Servicios:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8787`
- Ollama: `http://localhost:11434`

### Pull del modelo en contenedor Ollama

```bash
docker compose exec ollama ollama pull lfm2.5-thinking:1.2b
```

### Prueba rapida del modelo dentro del contenedor

```bash
docker compose exec ollama ollama run lfm2.5-thinking:1.2b "Di hola en una frase"
```

### Prueba del endpoint IA del backend

1. Inicia sesion y consigue un token.
2. Lanza:

```bash
curl -X POST http://localhost:8787/assistant/chat \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"Recomiendame un juego barato de aventura"}'
```

## Frontend implementado

- `/login` (publica)
- `/register` (publica)
- `/videojuegos` (protegida)
- `/mis-videojuegos` (protegida)
- `/videojuegos/nuevo` (protegida)
- `/videojuegos/:id` (protegida)
- `/admin/reportados` (protegida, solo admin)

Incluye:
- `AuthContext` para sesion (`token`, `user`, `login`, `logout`).
- Redireccion automatica a `/login` sin sesion.
- Componente de carga `Loading` durante peticiones.
- Uso de `axios` en lugar de `fetch`.

## Comprobaciones

```bash
npm run lint
npm run build
```

## Tests E2E (Playwright)

Los tests E2E cubren:
- Registro de usuario.
- Login incorrecto.
- Redireccion de rutas protegidas sin sesion.
- Listado (nombre, portada y precio).
- Busqueda.
- Filtros por categorias/plataformas.
- Paginacion.
- Crear videojuego.
- Ver detalle.
- Eliminar videojuego.
- Logout.

Comandos:

```bash
npx playwright install chromium
npm run test:e2e
```

Modo UI:

```bash
npm run test:e2e:ui
```
