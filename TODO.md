# TODO - App React de Videojuegos

## 1) Backend con json-server
- [x] Configurar `json-server` en el proyecto y scripts de arranque (`dev`, `dev:api`).
- [x] Tener datos precargados en `db.json`.
- [x] Reestructurar `db.json` para usar exactamente estas 3 colecciones: `videojuegos`, `categorias`, `plataformas`.
- [x] Cargar las categorias requeridas: Lucha, Arcade, Plataformas, Shooter, Estrategia, Simulacion, Deporte, Aventura, Rol, Educacion y Puzzle.
- [x] Cargar las plataformas requeridas: PC, PS5, Xbox One, Switch, Android, iOS y Otras.
- [x] Definir videojuegos con todos los campos: `id`, `nombre`, `descripcion`, `fechaLanzamiento`, `compania`, `plataformas`, `categorias`, `precio`, `urlImagen`, `urlVideo`.
- [x] Guardar `plataformas` y `categorias` como listas (un videojuego puede pertenecer a varias).

## 2) Capa de API
- [x] Existe un servicio base para `GET`, `POST`, `PUT` y `DELETE` (`src/apiService.js`).
- [x] Adaptar llamadas para trabajar con la coleccion `videojuegos`.
- [x] Añadir lectura de `categorias` y `plataformas` desde la app.

## 3) Listado de videojuegos
- [x] Reemplazar la logica/UI anterior por videojuegos.
- [x] Mostrar en cada tarjeta/lista: nombre, portada, plataformas, precio y descripcion truncada a 100 caracteres + `...`.

## 4) Menu de categorias (checkboxes)
- [x] Crear componente de menu horizontal de categorias.
- [x] Inicializar todos los checkboxes en activo.
- [x] Filtrar listado para mostrar solo videojuegos de categorias seleccionadas.

## 5) Menu de plataformas (checkboxes)
- [x] Crear menu horizontal de plataformas (mismo patron que categorias).
- [x] Inicializar todos los checkboxes en activo.
- [x] Filtrar listado para mostrar solo videojuegos de plataformas seleccionadas.

## 6) Caja de busqueda
- [x] Añadir caja de busqueda debajo del listado.
- [x] Buscar por termino en `nombre` o `descripcion`.
- [x] Combinar busqueda con filtros activos de categorias/plataformas.

## 7) Vista detallada del videojuego
- [x] Al seleccionar un videojuego, mostrar vista detallada con todos los campos.
- [x] Incluir boton para ocultar.
- [x] Mostrar detalle como modal con CSS.

## 8) Eliminar videojuego
- [x] Existe logica de borrado en backend (`DELETE`).
- [x] Añadir el boton de eliminar dentro de la vista detallada del videojuego.
- [x] Tras borrar, refrescar estado/listado y cerrar detalle si aplica.

## 9) Ajustes finales
- [x] Actualizar `README.md` con instrucciones del proyecto de videojuegos (arranque frontend + json-server).
- [x] Revisar estilos para que menus horizontales, listado y modal sean usables en desktop y movil.

## 10) V2 - API real con JWT (IDE Antigravity + IA)
- [x] Definir stack del backend y justificarlo por escrito (lenguaje, framework, base de datos, ORM y por que se elige).
- [x] Crear estructura del backend separada del prototipo `json-server` (carpeta `backend/`).
- [x] Configurar variables de entorno (`JWT_SECRET`, puertos, etc.).
- [x] Configurar persistencia real para usuarios y videojuegos (almacenamiento persistente JSON en `backend/data/db.json`).
- [x] Crear modelo de usuario con rol (`user` y `admin`).
- [x] Crear modelo de videojuego con relacion al usuario propietario (`userId`).
- [x] Implementar registro de usuarios (`/auth/register`).
- [x] Implementar login de usuarios (`/auth/login`) devolviendo JWT.
- [x] Implementar middleware de autenticacion JWT.
- [x] Implementar middleware de autorizacion por rol.
- [x] Crear endpoint protegido: obtener videojuegos de todos los usuarios con paginacion.
- [x] Crear endpoint protegido: obtener videojuegos del usuario autenticado con paginacion.
- [x] Crear endpoint protegido: obtener videojuego por `id`.
- [x] Crear endpoint protegido: crear videojuego nuevo (asociado al usuario autenticado).
- [x] Crear endpoint protegido: eliminar videojuego (solo propietario).
- [x] Permitir que el administrador pueda eliminar cualquier videojuego.
- [x] Incluir en respuestas del listado el nombre del usuario que anadio cada videojuego.
- [x] Documentar endpoints con ejemplos de request/response y codigos de error.

## 11) V2 - Frontend manual (React)
- [x] Instalar y usar `axios` para reemplazar llamadas `fetch`.
- [x] Crear `AuthContext` para guardar estado de autenticacion (token, usuario, rol, login/logout).
- [x] Guardar sesion de forma persistente (por ejemplo `localStorage`) y restaurarla al recargar.
- [x] Configurar `react-router-dom` con rutas publicas y protegidas.
- [x] Crear pagina publica `/login`.
- [x] Crear pagina publica `/register`.
- [x] Crear ruta protegida de listado de todos los videojuegos.
- [x] Crear ruta protegida de listado de mis videojuegos.
- [x] Crear ruta protegida para alta de videojuego.
- [x] Crear ruta protegida para detalle de videojuego.
- [x] Redirigir a `/login` cuando se intenta entrar en una ruta protegida sin sesion.
- [x] Crear componente global de carga (`Loading`) para peticiones al backend.
- [x] Mostrar en el listado de todos los videojuegos el nombre del usuario creador.
- [x] Adaptar acciones de eliminar segun permisos (propietario o admin).

## 12) V2 - Docker y cierre
- [x] Dockerizar backend con `Dockerfile`.
- [x] Crear `docker-compose.yml` para backend con persistencia de datos.
- [x] Añadir scripts/comandos de arranque para entorno local y Docker.
- [x] Probar flujo completo V2: registro, login, CRUD, permisos por rol y paginacion.
- [x] Actualizar `README.md` con guia de V2 (arranque local, variables, Docker y rutas).

## 13) V3 - Asistente IA con Ollama
- [x] Dockerizar el frontend.
- [x] Crear contenedor de Ollama en `docker-compose`.
- [x] Configurar el modelo `lfm2.5-thinking:1.2b` por entorno (`OLLAMA_MODEL`).
- [x] Documentar como hacer pull del modelo en el contenedor y probarlo.
- [x] Implementar endpoint protegido en backend para chat con IA (`POST /assistant/chat`).
- [x] Definir instrucciones del asistente para responder solo con juegos de la base de datos actual.
- [x] Implementar boton flotante en la esquina inferior derecha del frontend.
- [x] Implementar panel de chat para buscar y recomendar videojuegos.
- [x] Documentar el flujo completo en `README.md`.
