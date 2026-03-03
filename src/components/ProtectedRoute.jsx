import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loadingAuth } = useAuth();

  if (loadingAuth) return <Loading text="Comprobando sesion..." />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
