import { useEffect, useState } from "react";
import { getMisVideojuegosAPI } from "../apiService";
import Loading from "../components/Loading";
import GameCard from "../components/GameCard";

const MyGamesPage = () => {
  const [games, setGames] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const loadData = async (page = 1) => {
    setLoading(true);
    const data = await getMisVideojuegosAPI(page, 12);
    setGames(data.data);
    setPagination(data.pagination);
    setLoading(false);
  };

  useEffect(() => {
    loadData(1);
  }, []);

  if (loading) return <Loading text="Cargando mis videojuegos..." />;

  return (
    <section>
      <h2>Mis videojuegos</h2>

      <div className="grid-cards">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

      <div className="pager">
        <button disabled={pagination.page <= 1} onClick={() => loadData(pagination.page - 1)}>
          Anterior
        </button>

        <span>
          Pagina {pagination.page} de {pagination.totalPages}
        </span>

        <button
          disabled={pagination.page >= pagination.totalPages}
          onClick={() => loadData(pagination.page + 1)}
        >
          Siguiente
        </button>
      </div>
    </section>
  );
};

export default MyGamesPage;
