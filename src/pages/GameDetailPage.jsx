import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteVideojuegoAPI, getVideojuegoByIdAPI } from "../apiService";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";

const GameDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getVideojuegoByIdAPI(id);
        setGame(data);
      } catch (err) {
        setError(err.response?.data?.message || "No se pudo cargar el detalle");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("¿Seguro que quieres eliminar este videojuego?")) return;

    try {
      await deleteVideojuegoAPI(id);
      navigate("/videojuegos");
    } catch (err) {
      alert(err.response?.data?.message || "No se pudo eliminar");
    }
  };

  if (loading) return <Loading text="Cargando detalle..." />;
  if (error) return <p className="error">{error}</p>;
  if (!game) return null;

  const canDelete = user?.role === "admin" || Number(game.userId) === Number(user?.id);

  return (
    <section className="detail-page">
      <h2>{game.nombre}</h2>

      <img src={game.urlImagen || "https://picsum.photos/seed/fallbackdetail/800/450"} alt={game.nombre} />

      <p><strong>Usuario:</strong> {game.usuario}</p>
      <p><strong>Descripcion:</strong> {game.descripcion}</p>
      <p><strong>Fecha lanzamiento:</strong> {game.fechaLanzamiento || "-"}</p>
      <p><strong>Compañia:</strong> {game.compania || "-"}</p>
      <p><strong>Plataformas:</strong> {game.plataformas?.join(", ") || "-"}</p>
      <p><strong>Categorias:</strong> {game.categorias?.join(", ") || "-"}</p>
      <p><strong>Precio:</strong> {game.precio} €</p>

      {game.urlVideo && (
        <p>
          <a href={game.urlVideo} target="_blank" rel="noreferrer">
            Ver trailer
          </a>
        </p>
      )}

      {canDelete && (
        <button className="danger" onClick={handleDelete}>
          Eliminar
        </button>
      )}
    </section>
  );
};

export default GameDetailPage;
