import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="page-shell">
      <header className="topbar">
        <h1>Videojuegos V2</h1>

        <nav>
          <Link to="/videojuegos">Todos</Link>
          <Link to="/mis-videojuegos">Mis videojuegos</Link>
          <Link to="/videojuegos/nuevo">Nuevo</Link>
        </nav>

        <div className="topbar-right">
          <span>
            {user?.username} ({user?.role})
          </span>
          <button onClick={handleLogout}>Salir</button>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
