# Proyecto React - Videojuegos V2 (JWT + CRUD)

Aplicacion completa con frontend en React y backend propio con autenticacion JWT y roles (`user`, `admin`).

## Stack elegido (y por que)

- Frontend: React + Vite + React Router + Axios + Material UI.
- Backend: Node.js + Express.
- Persistencia: almacenamiento persistente en JSON (`backend/data/db.json`).
- Auth: JWT + `bcryptjs` para hash de contraseñas.
- Docker: `Dockerfile` para backend y `docker-compose.yml` para levantarlo con volumen persistente.

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

- `src/`: frontend React (manual)
- `backend/`: API JWT + CRUD
- `backend/data/db.json`: datos persistentes de usuarios y videojuegos
- `docker-compose.yml`: arranque del backend dockerizado

## Instalacion

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
  - body ejemplo:
    ```json
    {
      "nombre": "Hollow Knight",
      "descripcion": "Metroidvania 2D",
      "fechaLanzamiento": "2017-02-24",
      "compania": "Team Cherry",
      "plataformas": ["PC", "Switch"],
      "categorias": ["Plataformas", "Aventura"],
      "precio": 14.99,
      "urlImagen": "https://...",
      "urlVideo": "https://..."
    }
    ```
- `DELETE /videojuegos/:id`
  - `user`: solo elimina los suyos.
  - `admin`: puede eliminar cualquiera.

## Frontend implementado (manual)

- `/login` (publica)
- `/register` (publica)
- `/videojuegos` (protegida)
- `/mis-videojuegos` (protegida)
- `/videojuegos/nuevo` (protegida)
- `/videojuegos/:id` (protegida)

Incluye:
- `AuthContext` para sesion (`token`, `user`, `login`, `logout`).
- Redireccion automatica a `/login` sin sesion.
- Componente de carga `Loading` durante peticiones.
- Uso de `axios` en lugar de `fetch`.

## Docker

### Backend dockerizado

```bash
docker compose up --build
```

Esto levanta el backend en `http://localhost:8787` con volumen persistente en `backend/data`.

## Comprobaciones

```bash
npm run lint
npm run build
```
