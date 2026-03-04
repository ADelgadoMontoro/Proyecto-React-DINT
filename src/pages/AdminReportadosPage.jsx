import { useEffect, useState } from "react";
import { Alert, Button, Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteReportadoAPI, getReportadosAPI } from "../apiService";
import Loading from "../components/Loading";

const AdminReportadosPage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getReportadosAPI();
      setGames(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "No se pudieron cargar los reportados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar videojuego reportado?")) return;

    try {
      await deleteReportadoAPI(id);
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || "No se pudo eliminar");
    }
  };

  if (loading) return <Loading text="Cargando reportados..." />;

  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={800}>
        Videojuegos reportados (admin)
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      {!error && games.length === 0 && (
        <Alert severity="success">No hay videojuegos reportados.</Alert>
      )}

      <Grid container spacing={2}>
        {games.map((game) => (
          <Grid key={game.id} size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="h6">{game.nombre}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Subido por: {game.usuario}
                  </Typography>
                  <Typography variant="body2">Reportes: {game.reportesCount}</Typography>

                  <Button
                    color="error"
                    variant="contained"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(game.id)}
                  >
                    Eliminar videojuego
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

export default AdminReportadosPage;
