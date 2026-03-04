import { Navigate } from "react-router-dom";
import Loading from "./Loading";
import { useAuth } from "../context/useAuth";

const AdminRoute = ({ children }) => {
  const { user, loadingAuth } = useAuth();

  if (loadingAuth) return <Loading text="Comprobando permisos..." />;

  if (!user || user.role !== "admin") {
    return <Navigate to="/videojuegos" replace />;
  }

  return children;
};

export default AdminRoute;
