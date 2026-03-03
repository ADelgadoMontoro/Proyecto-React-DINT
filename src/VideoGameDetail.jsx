const VideoGameDetail = ({ videojuego, onClose, onDelete }) => {
  if (!videojuego) return null;

  return (
    <div className="modal-fondo">
      <div className="modal-caja">
        <h3>{videojuego.nombre}</h3>
        <img src={videojuego.urlImagen} alt={videojuego.nombre} className="detail-img" />
        <p><strong>ID:</strong> {videojuego.id}</p>
        <p><strong>Descripcion:</strong> {videojuego.descripcion}</p>
        <p><strong>Fecha de lanzamiento:</strong> {videojuego.fechaLanzamiento}</p>
        <p><strong>Compañia:</strong> {videojuego.compania}</p>
        <p><strong>Plataformas:</strong> {videojuego.plataformas.join(", ")}</p>
        <p><strong>Categorias:</strong> {videojuego.categorias.join(", ")}</p>
        <p><strong>Precio:</strong> {videojuego.precio} €</p>
        <p>
          <strong>Video:</strong>{" "}
          <a href={videojuego.urlVideo} target="_blank" rel="noreferrer">
            Ver trailer
          </a>
        </p>

        <div className="detail-actions">
          <button type="button" onClick={() => onDelete(videojuego.id)}>
            Eliminar videojuego
          </button>
          <button type="button" onClick={onClose}>
            Ocultar detalle
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoGameDetail;
