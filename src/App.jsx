import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AllGamesPage from "./pages/AllGamesPage";
import MyGamesPage from "./pages/MyGamesPage";
import NewGamePage from "./pages/NewGamePage";
import GameDetailPage from "./pages/GameDetailPage";
import AdminReportadosPage from "./pages/AdminReportadosPage";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/videojuegos" replace />} />
        <Route path="/videojuegos" element={<AllGamesPage />} />
        <Route path="/mis-videojuegos" element={<MyGamesPage />} />
        <Route path="/videojuegos/nuevo" element={<NewGamePage />} />
        <Route path="/videojuegos/:id" element={<GameDetailPage />} />
        <Route
          path="/admin/reportados"
          element={(
            <AdminRoute>
              <AdminReportadosPage />
            </AdminRoute>
          )}
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
