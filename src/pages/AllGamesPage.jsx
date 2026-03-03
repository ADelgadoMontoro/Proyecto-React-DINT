import { useEffect, useState } from "react";
import { getVideojuegosAPI } from "../apiService";
import Loading from "../components/Loading";
import GameCard from "../components/GameCard";

const AllGamesPage = () => {
  const [games, setGames] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const loadData = async (page = 1) => {
    setLoading(true);
    const data = await getVideojuegosAPI(page, 12);
    setGames(data.data);
    setPagination(data.pagination);
    setLoading(false);
  };

  useEffect(() => {
    loadData(1);
  }, []);

  if (loading) return <Loading text="Cargando videojuegos..." />;

  return (
    <section>
      <h2>Todos los videojuegos</h2>

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

export default AllGamesPage;
