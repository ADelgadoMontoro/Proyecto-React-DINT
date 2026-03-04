import { Link as RouterLink } from "react-router-dom";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography
} from "@mui/material";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";

const GameCard = ({ game, onVote }) => {
  const text =
    game.descripcion.length > 100
      ? game.descripcion.slice(0, 100) + "..."
      : game.descripcion;

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardMedia
        component="img"
        height="170"
        image={game.urlImagen || "https://picsum.photos/seed/fallback/800/450"}
        alt={game.nombre}
      />

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" sx={{ fontSize: "1.05rem", mb: 1 }}>
          {game.nombre}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Subido por: {game.usuario}
        </Typography>

        <Typography variant="body2" sx={{ mb: 1 }}>
          {text}
        </Typography>

        <Stack direction="row" spacing={1}>
          <Typography variant="body2" fontWeight={700}>
            Precio:
          </Typography>
          <Typography variant="body2">{game.precio} €</Typography>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <Chip size="small" color="success" label={`Likes: ${game.likes || 0}`} />
          <Chip size="small" color="error" label={`Dislikes: ${game.dislikes || 0}`} />
          <Chip size="small" color="secondary" label={`Pop: ${game.popularidad || 0}`} />
        </Stack>
      </CardContent>

      <CardActions>
        <Button
          size="small"
          color="success"
          startIcon={<ThumbUpAltOutlinedIcon />}
          disabled={!onVote || game.votoUsuario !== null}
          onClick={() => onVote && onVote(game.id, "like")}
        >
          Like
        </Button>
        <Button
          size="small"
          color="error"
          startIcon={<ThumbDownAltOutlinedIcon />}
          disabled={!onVote || game.votoUsuario !== null}
          onClick={() => onVote && onVote(game.id, "dislike")}
        >
          Dislike
        </Button>
        <Button component={RouterLink} to={`/videojuegos/${game.id}`} variant="contained" size="small">
          Ver detalle
        </Button>
      </CardActions>
    </Card>
  );
};

export default GameCard;
