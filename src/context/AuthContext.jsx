/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { loginAPI, registerAPI } from "../apiService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const tokenGuardado = localStorage.getItem("token") || "";
    const userGuardado = localStorage.getItem("user");

    if (tokenGuardado && userGuardado) {
      setToken(tokenGuardado);
      setUser(JSON.parse(userGuardado));
    }

    setLoadingAuth(false);
  }, []);

  const guardarSesion = (tokenNuevo, userNuevo) => {
    setToken(tokenNuevo);
    setUser(userNuevo);
    localStorage.setItem("token", tokenNuevo);
    localStorage.setItem("user", JSON.stringify(userNuevo));
  };

  const login = async (username, password) => {
    const data = await loginAPI(username, password);
    guardarSesion(data.token, data.user);
  };

  const register = async (form) => {
    await registerAPI(form);
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const isAuthenticated = token !== "";

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        register,
        logout,
        isAuthenticated,
        loadingAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
