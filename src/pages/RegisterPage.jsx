import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Alert, Box, Button, Link, Paper, Stack, TextField, Typography } from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useAuth } from "../context/useAuth";

const emptyForm = {
  username: "",
  email: "",
  password: ""
};

const RegisterPage = () => {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const parsearDatos = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOk("");
    setLoading(true);

    try {
      await register(form);
      setOk("Registro correcto. Ya puedes iniciar sesion.");
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      setError(err.response?.data?.message || "No se pudo registrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", p: 2 }}>
      <Paper elevation={4} sx={{ p: 3, width: "100%", maxWidth: 420 }}>
        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
          <Typography variant="h5" fontWeight={800}>
            Registro
          </Typography>

          <TextField name="username" label="Usuario" value={form.username} onChange={parsearDatos} required />
          <TextField name="email" label="Email" type="email" value={form.email} onChange={parsearDatos} required />
          <TextField
            name="password"
            label="Password (min 6)"
            type="password"
            value={form.password}
            onChange={parsearDatos}
            minLength={6}
            required
          />

          {error && <Alert severity="error">{error}</Alert>}
          {ok && <Alert severity="success">{ok}</Alert>}

          <Button type="submit" variant="contained" startIcon={<PersonAddAlt1Icon />} disabled={loading}>
            {loading ? "Creando..." : "Crear cuenta"}
          </Button>

          <Typography variant="body2">
            Ya tienes cuenta?{" "}
            <Link component={RouterLink} to="/login" underline="hover">
              Inicia sesion
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
