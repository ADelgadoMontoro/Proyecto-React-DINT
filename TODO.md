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
- [ ] Hacer prueba manual completa de flujo: listar, filtrar, buscar, detalle y eliminar.
