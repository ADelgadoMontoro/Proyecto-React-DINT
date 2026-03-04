import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { getVideojuegosAPI, votarVideojuegoAPI } from "../apiService";
import Loading from "../components/Loading";
import GameCard from "../components/GameCard";

const CATEGORIAS = [
  "Lucha",
  "Arcade",
  "Plataformas",
  "Shooter",
  "Estrategia",
  "Simulación",
  "Deporte",
  "Aventura",
  "Rol",
  "Educación",
  "Puzzle"
];

const PLATAFORMAS = ["PC", "PS5", "Xbox One", "Switch", "Android", "iOS", "Otras"];

const AllGamesPage = () => {
  const [games, setGames] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [loading, setLoading] = useState(true);
  const [porPagina, setPorPagina] = useState(6);
  const [orden, setOrden] = useState("fecha");
  const [busqueda, setBusqueda] = useState("");
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [plataformasSeleccionadas, setPlataformasSeleccionadas] = useState([]);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getVideojuegosAPI(1, 100, orden);
      setGames(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "No se pudieron cargar los videojuegos");
    } finally {
      setLoading(false);
    }
  }, [orden]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    setPaginaActual(1);
  }, [porPagina, busqueda, categoriasSeleccionadas, plataformasSeleccionadas, orden]);

  const handleVote = async (id, tipo) => {
    try {
      await votarVideojuegoAPI(id, tipo);
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || "No se pudo registrar el voto");
    }
  };

  const toggleCategoria = (categoria) => {
    if (categoriasSeleccionadas.includes(categoria)) {
      setCategoriasSeleccionadas((prev) => prev.filter((item) => item !== categoria));
      return;
    }
    setCategoriasSeleccionadas((prev) => [...prev, categoria]);
  };

  const togglePlataforma = (plataforma) => {
    if (plataformasSeleccionadas.includes(plataforma)) {
      setPlataformasSeleccionadas((prev) => prev.filter((item) => item !== plataforma));
      return;
    }
    setPlataformasSeleccionadas((prev) => [...prev, plataforma]);
  };

  const gamesFiltrados = games.filter((game) => {
    const texto = `${game.nombre} ${game.descripcion}`.toLowerCase();
    const coincideBusqueda = texto.includes(busqueda.toLowerCase().trim());

    const coincideCategoria = categoriasSeleccionadas.length === 0
      || (game.categorias || []).some((categoria) => categoriasSeleccionadas.includes(categoria));

    const coincidePlataforma = plataformasSeleccionadas.length === 0
      || (game.plataformas || []).some((plataforma) => plataformasSeleccionadas.includes(plataforma));

    return coincideBusqueda && coincideCategoria && coincidePlataforma;
  });

  const totalPaginas = Math.max(Math.ceil(gamesFiltrados.length / porPagina), 1);
  const start = (paginaActual - 1) * porPagina;
  const gamesPaginados = gamesFiltrados.slice(start, start + porPagina);

  if (loading) return <Loading text="Cargando videojuegos..." />;

  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={800}>
        Todos los videojuegos
      </Typography>

      <TextField
        label="Buscar por nombre o descripcion"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        size="small"
        inputProps={{ "data-testid": "search-input" }}
      />

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <FormControl size="small" sx={{ width: 240 }}>
          <InputLabel id="all-page-size">Videojuegos por pagina</InputLabel>
          <Select
            data-testid="page-size-select"
            labelId="all-page-size"
            label="Videojuegos por pagina"
            value={porPagina}
            onChange={(e) => setPorPagina(Number(e.target.value))}
          >
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={6}>6</MenuItem>
            <MenuItem value={12}>12</MenuItem>
            <MenuItem value={18}>18</MenuItem>
            <MenuItem value={24}>24</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ width: 240 }}>
          <InputLabel id="all-order">Ordenar por</InputLabel>
          <Select
            data-testid="order-select"
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

      <Typography variant="body2" color="text.secondary" data-testid="results-count">
        Resultados: {gamesFiltrados.length}
      </Typography>

      <Paper variant="outlined" sx={{ p: 1.5 }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
          Categorias
        </Typography>
        <FormGroup row>
          {CATEGORIAS.map((categoria) => (
            <FormControlLabel
              key={categoria}
              control={(
                <Checkbox
                  checked={categoriasSeleccionadas.includes(categoria)}
                  onChange={() => toggleCategoria(categoria)}
                />
              )}
              label={categoria}
            />
          ))}
        </FormGroup>
      </Paper>

      <Paper variant="outlined" sx={{ p: 1.5 }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
          Plataformas
        </Typography>
        <FormGroup row>
          {PLATAFORMAS.map((plataforma) => (
            <FormControlLabel
              key={plataforma}
              control={(
                <Checkbox
                  checked={plataformasSeleccionadas.includes(plataforma)}
                  onChange={() => togglePlataforma(plataforma)}
                />
              )}
              label={plataforma}
            />
          ))}
        </FormGroup>
      </Paper>

      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={2}>
        {gamesPaginados.map((game) => (
          <Grid key={game.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <GameCard game={game} onVote={handleVote} />
          </Grid>
        ))}
      </Grid>

      <Stack alignItems="center" pt={1}>
        <Pagination
          data-testid="pagination"
          color="primary"
          page={paginaActual}
          count={totalPaginas}
          onChange={(_, value) => setPaginaActual(value)}
        />
      </Stack>
    </Stack>
  );
};

export default AllGamesPage;
