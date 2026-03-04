import { Link as RouterLink } from "react-router-dom";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Stack,
  Typography
} from "@mui/material";

const GameCard = ({ game }) => {
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
      </CardContent>

      <CardActions>
        <Button component={RouterLink} to={`/videojuegos/${game.id}`} variant="contained" size="small">
          Ver detalle
        </Button>
      </CardActions>
    </Card>
  );
};

export default GameCard;
