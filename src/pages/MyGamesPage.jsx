import { useCallback, useEffect, useState } from "react";
import { Alert, FormControl, Grid, InputLabel, MenuItem, Pagination, Select, Stack, Typography } from "@mui/material";
import { getMisVideojuegosAPI } from "../apiService";
import Loading from "../components/Loading";
import GameCard from "../components/GameCard";

const MyGamesPage = () => {
  const [misJuegos, setMisJuegos] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [porPagina, setPorPagina] = useState(12);

  const cargarMisJuegos = useCallback(async (pagina = 1, limit = porPagina) => {
    setCargando(true);
    setError("");

    try {
      const respuesta = await getMisVideojuegosAPI(pagina, limit);
      setMisJuegos(respuesta.data);
      setPaginaActual(respuesta.pagination.page);
      setTotalPaginas(respuesta.pagination.totalPages || 1);
    } catch (err) {
      setError(err.response?.data?.message || "No se pudieron cargar tus videojuegos");
    } finally {
      setCargando(false);
    }
  }, [porPagina]);

  useEffect(() => {
    cargarMisJuegos(1, porPagina);
  }, [cargarMisJuegos, porPagina]);

  if (cargando) return <Loading text="Cargando mis videojuegos..." />;

  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={800}>
        Mis videojuegos
      </Typography>

      <FormControl size="small" sx={{ width: 240 }}>
        <InputLabel id="my-page-size">Videojuegos por pagina</InputLabel>
        <Select
          labelId="my-page-size"
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

      {error && <Alert severity="error">{error}</Alert>}

      {!error && misJuegos.length === 0 && (
        <Alert severity="info">Aun no has creado videojuegos.</Alert>
      )}

      <Grid container spacing={2}>
        {misJuegos.map((game) => (
          <Grid key={game.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <GameCard game={game} />
          </Grid>
        ))}
      </Grid>

      {totalPaginas > 1 && (
        <Stack alignItems="center" pt={1}>
          <Pagination
            color="primary"
            page={paginaActual}
            count={totalPaginas}
            onChange={(_, value) => cargarMisJuegos(value, porPagina)}
          />
        </Stack>
      )}
    </Stack>
  );
};

export default MyGamesPage;
