import { Link as RouterLink, Outlet, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
  Chip
} from "@mui/material";
import { useAuth } from "../context/useAuth";

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box>
      <AppBar position="sticky" elevation={1}>
        <Toolbar sx={{ gap: 2, flexWrap: "wrap", py: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mr: 2 }}>
            Videojuegos V2
          </Typography>

          <Stack direction="row" spacing={1} sx={{ flexGrow: 1, flexWrap: "wrap" }}>
            <Button component={RouterLink} to="/videojuegos" variant="contained" color="secondary">
              Todos
            </Button>
            <Button component={RouterLink} to="/mis-videojuegos" variant="contained" color="secondary">
              Mis videojuegos
            </Button>
            <Button component={RouterLink} to="/videojuegos/nuevo" variant="contained" color="secondary">
              Nuevo
            </Button>
            {user?.role === "admin" && (
              <Button component={RouterLink} to="/admin/reportados" variant="contained" color="secondary">
                Reportados
              </Button>
            )}
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label={`${user?.username || ""} (${user?.role || ""})`}
              color="default"
              sx={{ bgcolor: "white" }}
            />
            <Button onClick={handleLogout} variant="outlined" sx={{ color: "white", borderColor: "white" }}>
              Salir
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default Layout;
