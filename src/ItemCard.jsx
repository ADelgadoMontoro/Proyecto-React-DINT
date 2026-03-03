const ItemCard = ({ videojuego, onSelect }) => {
  const descripcionCorta =
    videojuego.descripcion.length > 100
      ? videojuego.descripcion.slice(0, 100) + "..."
      : videojuego.descripcion + "...";

  return (
    <div className="card-videojuego" onClick={() => onSelect(videojuego)}>
      <h4>{videojuego.nombre}</h4>
      <img src={videojuego.urlImagen} alt={videojuego.nombre} className="card-img" />
      <p><strong>Plataformas:</strong> {videojuego.plataformas.join(", ")}</p>
      <p><strong>Precio:</strong> {videojuego.precio} €</p>
      <p>{descripcionCorta}</p>
      <button type="button">Ver detalle</button>
    </div>
  );
};

export default ItemCard;
