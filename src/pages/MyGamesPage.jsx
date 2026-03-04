import { useEffect, useState } from "react";
import { Alert, Grid, Pagination, Stack, Typography } from "@mui/material";
import { getMisVideojuegosAPI } from "../apiService";
import Loading from "../components/Loading";
import GameCard from "../components/GameCard";

const MyGamesPage = () => {
  const [misJuegos, setMisJuegos] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargarMisJuegos = async (pagina = 1) => {
    setCargando(true);
    setError("");

    try {
      const respuesta = await getMisVideojuegosAPI(pagina, 12);
      setMisJuegos(respuesta.data);
      setPaginaActual(respuesta.pagination.page);
      setTotalPaginas(respuesta.pagination.totalPages || 1);
    } catch (err) {
      setError(err.response?.data?.message || "No se pudieron cargar tus videojuegos");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarMisJuegos(1);
  }, []);

  if (cargando) return <Loading text="Cargando mis videojuegos..." />;

  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={800}>
        Mis videojuegos
      </Typography>

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
            onChange={(_, value) => cargarMisJuegos(value)}
          />
        </Stack>
      )}
    </Stack>
  );
};

export default MyGamesPage;
