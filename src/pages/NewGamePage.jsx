import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { addVideojuegoAPI } from "../apiService";

const emptyForm = {
  nombre: "",
  descripcion: "",
  fechaLanzamiento: "",
  compania: "",
  plataformas: "",
  categorias: "",
  precio: "",
  urlImagen: "",
  urlVideo: ""
};

const NewGamePage = () => {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const parsearDatos = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const convertirALista = (value) => {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      ...form,
      plataformas: convertirALista(form.plataformas),
      categorias: convertirALista(form.categorias),
      precio: Number(form.precio) || 0
    };

    try {
      const data = await addVideojuegoAPI(payload);
      navigate(`/videojuegos/${data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || "No se pudo crear el videojuego");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: { xs: 2, md: 3 } }}>
      <Stack spacing={2} component="form" onSubmit={handleSubmit}>
        <Typography variant="h4" fontWeight={800}>
          Alta de videojuego
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField name="nombre" label="Nombre" value={form.nombre} onChange={parsearDatos} required fullWidth />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              name="compania"
              label="Compañia"
              value={form.compania}
              onChange={parsearDatos}
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              name="descripcion"
              label="Descripcion"
              value={form.descripcion}
              onChange={parsearDatos}
              multiline
              minRows={3}
              required
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              name="fechaLanzamiento"
              label="Fecha lanzamiento"
              type="date"
              value={form.fechaLanzamiento}
              onChange={parsearDatos}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              name="precio"
              label="Precio"
              type="number"
              inputProps={{ step: "0.01" }}
              value={form.precio}
              onChange={parsearDatos}
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              name="plataformas"
              label="Plataformas (PC, PS5...)"
              value={form.plataformas}
              onChange={parsearDatos}
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              name="categorias"
              label="Categorias (Rol, Shooter...)"
              value={form.categorias}
              onChange={parsearDatos}
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              name="urlImagen"
              label="URL imagen"
              value={form.urlImagen}
              onChange={parsearDatos}
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              name="urlVideo"
              label="URL video"
              value={form.urlVideo}
              onChange={parsearDatos}
              fullWidth
            />
          </Grid>
        </Grid>

        {error && <Alert severity="error">{error}</Alert>}

        <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={loading}>
          {loading ? "Guardando..." : "Crear videojuego"}
        </Button>
      </Stack>
    </Paper>
  );
};

export default NewGamePage;
