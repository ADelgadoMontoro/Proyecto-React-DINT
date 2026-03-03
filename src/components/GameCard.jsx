import { Link } from "react-router-dom";

const GameCard = ({ game }) => {
  const text =
    game.descripcion.length > 100
      ? game.descripcion.slice(0, 100) + "..."
      : game.descripcion;

  return (
    <article className="game-card">
      <img
        src={game.urlImagen || "https://picsum.photos/seed/fallback/800/450"}
        alt={game.nombre}
      />
      <h3>{game.nombre}</h3>
      <p className="owner">Subido por: {game.usuario}</p>
      <p>{text}</p>
      <p>
        <strong>Precio:</strong> {game.precio} €
      </p>
      <Link to={`/videojuegos/${game.id}`}>Ver detalle</Link>
    </article>
  );
};

export default GameCard;
