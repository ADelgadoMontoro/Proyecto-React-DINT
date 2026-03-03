# Proyecto React - Catalogo de Videojuegos

Aplicacion hecha con React y `json-server` para gestionar un catalogo de videojuegos.

## Requisitos

- Node.js instalado
- npm instalado

## Instalacion

```bash
npm install
```

## Ejecutar proyecto

Para levantar frontend y backend a la vez:

```bash
npm run dev
```

- Frontend (Vite): `http://localhost:5173`
- API (`json-server`): `http://localhost:3001`

## Scripts utiles

- `npm run dev`: frontend + backend
- `npm run dev:client`: solo frontend
- `npm run dev:api`: solo backend
- `npm run build`: build de produccion

## Colecciones de la API

- `categorias`
- `plataformas`
- `videojuegos`

## Funcionalidades implementadas

- Listado de videojuegos con:
  - nombre
  - portada
  - plataformas
  - precio
  - descripcion recortada a 100 caracteres + `...`
- Filtro por categorias (checkboxes)
- Filtro por plataformas (checkboxes)
- Busqueda por nombre o descripcion
- Vista detallada en modal
- Eliminacion de videojuego desde la vista detallada
