import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Button,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
  Box
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import Loading from "../components/Loading";
import {
  addComentarioAPI,
  deleteComentarioAPI,
  deleteVideojuegoAPI,
  getVideojuegoByIdAPI,
  reportarVideojuegoAPI
} from "../apiService";
import { useAuth } from "../context/useAuth";

const GameDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comentario, setComentario] = useState("");
  const [guardandoComentario, setGuardandoComentario] = useState(false);

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

  const handleAddComentario = async (e) => {
    e.preventDefault();
    if (!comentario.trim()) return;

    setGuardandoComentario(true);
    try {
      await addComentarioAPI(id, comentario);
      const data = await getVideojuegoByIdAPI(id);
      setGame(data);
      setComentario("");
    } catch (err) {
      alert(err.response?.data?.message || "No se pudo guardar el comentario");
    } finally {
      setGuardandoComentario(false);
    }
  };

  const canDeleteComentario = (comentarioItem) => {
    if (user?.role === "admin") return true;
    const esMio = Number(comentarioItem.userId) === Number(user?.id);
    const tieneRespuestas = Array.isArray(comentarioItem.respuestas) && comentarioItem.respuestas.length > 0;
    return esMio && !tieneRespuestas;
  };

  const handleDeleteComentario = async (comentarioId) => {
    try {
      await deleteComentarioAPI(id, comentarioId);
      const data = await getVideojuegoByIdAPI(id);
      setGame(data);
    } catch (err) {
      alert(err.response?.data?.message || "No se pudo eliminar el comentario");
    }
  };

  const handleReportar = async () => {
    try {
      await reportarVideojuegoAPI(id);
      const data = await getVideojuegoByIdAPI(id);
      setGame(data);
      alert("Videojuego reportado correctamente");
    } catch (err) {
      alert(err.response?.data?.message || "No se pudo reportar el videojuego");
    }
  };

  if (loading) return <Loading text="Cargando detalle..." />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!game) return null;

  const canDelete = user?.role === "admin" || Number(game.userId) === Number(user?.id);

  return (
    <Paper elevation={2} sx={{ p: { xs: 2, md: 3 } }}>
      <Stack spacing={2}>
        <Typography variant="h4" fontWeight={800}>
          {game.nombre}
        </Typography>

        <Box
          component="img"
          src={game.urlImagen || "https://picsum.photos/seed/fallbackdetail/800/450"}
          alt={game.nombre}
          sx={{ width: "100%", maxHeight: 360, objectFit: "cover", borderRadius: 2 }}
        />

        <Typography><strong>Usuario:</strong> {game.usuario}</Typography>
        <Typography><strong>Descripcion:</strong> {game.descripcion}</Typography>
        <Typography><strong>Fecha lanzamiento:</strong> {game.fechaLanzamiento || "-"}</Typography>
        <Typography><strong>Compañia:</strong> {game.compania || "-"}</Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          {(game.plataformas || []).map((p) => (
            <Chip key={p} label={p} color="info" variant="outlined" />
          ))}
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          {(game.categorias || []).map((c) => (
            <Chip key={c} label={c} color="secondary" variant="outlined" />
          ))}
        </Stack>

        <Typography><strong>Precio:</strong> {game.precio} €</Typography>
        <Typography><strong>Reportes:</strong> {game.reportesCount || 0}</Typography>

        {game.urlVideo && (
          <Link href={game.urlVideo} target="_blank" rel="noreferrer" underline="hover">
            Ver trailer
          </Link>
        )}

        <Button
          color="warning"
          variant="outlined"
          startIcon={<ReportProblemIcon />}
          disabled={Boolean(game.reportadoPorUsuario)}
          onClick={handleReportar}
        >
          {game.reportadoPorUsuario ? "Ya reportado" : "Reportar inapropiado"}
        </Button>

        <Divider />

        <Typography variant="h6">Comentarios</Typography>

        <Stack component="form" spacing={1} onSubmit={handleAddComentario}>
          <TextField
            label="Escribe un comentario"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            multiline
            minRows={2}
          />
          <Button type="submit" variant="outlined" disabled={guardandoComentario}>
            {guardandoComentario ? "Guardando..." : "Añadir comentario"}
          </Button>
        </Stack>

        {Array.isArray(game.comentarios) && game.comentarios.length > 0 ? (
          <List>
            {game.comentarios.map((c) => (
              <ListItem key={c.id} alignItems="flex-start">
                <ListItemText
                  primary={`${c.usuario} · ${new Date(c.createdAt).toLocaleString()}`}
                  secondary={c.texto}
                />
                {canDeleteComentario(c) && (
                  <ListItemSecondaryAction>
                    <IconButton edge="end" color="error" onClick={() => handleDeleteComentario(c.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography color="text.secondary">Todavia no hay comentarios.</Typography>
        )}

        {canDelete && (
          <Button color="error" variant="contained" startIcon={<DeleteIcon />} onClick={handleDelete}>
            Eliminar
          </Button>
        )}
      </Stack>
    </Paper>
  );
};

export default GameDetailPage;
