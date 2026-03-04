import { useEffect, useState } from "react";
import { Grid, Pagination, Stack, Typography } from "@mui/material";
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
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={800}>
        Todos los videojuegos
      </Typography>

      <Grid container spacing={2}>
        {games.map((game) => (
          <Grid key={game.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <GameCard game={game} />
          </Grid>
        ))}
      </Grid>

      <Stack alignItems="center" pt={1}>
        <Pagination
          color="primary"
          page={pagination.page}
          count={pagination.totalPages || 1}
          onChange={(_, value) => loadData(value)}
        />
      </Stack>
    </Stack>
  );
};

export default AllGamesPage;
