import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Registro</h2>

        <input
          name="username"
          type="text"
          placeholder="Usuario"
          value={form.username}
          onChange={parsearDatos}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={parsearDatos}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password (min 6)"
          value={form.password}
          onChange={parsearDatos}
          minLength={6}
          required
        />

        {error && <p className="error">{error}</p>}
        {ok && <p className="ok">{ok}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Creando..." : "Crear cuenta"}
        </button>

        <p>
          Ya tienes cuenta? <Link to="/login">Inicia sesion</Link>
        </p>
      </form>
    </section>
  );
};

export default RegisterPage;
