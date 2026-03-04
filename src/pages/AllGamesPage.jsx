import { useCallback, useEffect, useState } from "react";
import { FormControl, Grid, InputLabel, MenuItem, Pagination, Select, Stack, Typography } from "@mui/material";
import { getVideojuegosAPI } from "../apiService";
import Loading from "../components/Loading";
import GameCard from "../components/GameCard";

const AllGamesPage = () => {
  const [games, setGames] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [porPagina, setPorPagina] = useState(12);

  const loadData = useCallback(async (page = 1, limit = porPagina) => {
    setLoading(true);
    const data = await getVideojuegosAPI(page, limit);
    setGames(data.data);
    setPagination(data.pagination);
    setLoading(false);
  }, [porPagina]);

  useEffect(() => {
    loadData(1, porPagina);
  }, [loadData, porPagina]);

  if (loading) return <Loading text="Cargando videojuegos..." />;

  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={800}>
        Todos los videojuegos
      </Typography>

      <FormControl size="small" sx={{ width: 240 }}>
        <InputLabel id="all-page-size">Videojuegos por pagina</InputLabel>
        <Select
          labelId="all-page-size"
          label="Videojuegos por pagina"
          value={porPagina}
          onChange={(e) => setPorPagina(Number(e.target.value))}
        >
          <MenuItem value={6}>6</MenuItem>
          <MenuItem value={12}>12</MenuItem>
          <MenuItem value={18}>18</MenuItem>
          <MenuItem value={24}>24</MenuItem>
        </Select>
      </FormControl>

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
          onChange={(_, value) => loadData(value, porPagina)}
        />
      </Stack>
    </Stack>
  );
};

export default AllGamesPage;
