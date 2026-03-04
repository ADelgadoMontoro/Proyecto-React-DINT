import { useCallback, useEffect, useState } from "react";
import { Alert, FormControl, Grid, InputLabel, MenuItem, Pagination, Select, Stack, Typography } from "@mui/material";
import { getVideojuegosAPI, votarVideojuegoAPI } from "../apiService";
import Loading from "../components/Loading";
import GameCard from "../components/GameCard";

const AllGamesPage = () => {
  const [games, setGames] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [porPagina, setPorPagina] = useState(12);
  const [orden, setOrden] = useState("fecha");
  const [error, setError] = useState("");

  const loadData = useCallback(async (page = 1, limit = porPagina) => {
    setLoading(true);
    setError("");
    try {
      const data = await getVideojuegosAPI(page, limit, orden);
      setGames(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "No se pudieron cargar los videojuegos");
    } finally {
      setLoading(false);
    }
  }, [porPagina, orden]);

  useEffect(() => {
    loadData(1, porPagina);
  }, [loadData, porPagina, orden]);

  const handleVote = async (id, tipo) => {
    try {
      await votarVideojuegoAPI(id, tipo);
      await loadData(pagination.page, porPagina);
    } catch (err) {
      alert(err.response?.data?.message || "No se pudo registrar el voto");
    }
  };

  if (loading) return <Loading text="Cargando videojuegos..." />;

  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={800}>
        Todos los videojuegos
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
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

        <FormControl size="small" sx={{ width: 240 }}>
          <InputLabel id="all-order">Ordenar por</InputLabel>
          <Select
            labelId="all-order"
            label="Ordenar por"
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
          >
            <MenuItem value="fecha">Mas recientes</MenuItem>
            <MenuItem value="popularidad">Popularidad</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={2}>
        {games.map((game) => (
          <Grid key={game.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <GameCard game={game} onVote={handleVote} />
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
