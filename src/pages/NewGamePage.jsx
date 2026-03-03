import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <section>
      <h2>Alta de videojuego</h2>

      <form className="game-form" onSubmit={handleSubmit}>
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={parsearDatos} required />

        <textarea
          name="descripcion"
          placeholder="Descripcion"
          value={form.descripcion}
          onChange={parsearDatos}
          required
        />

        <input name="fechaLanzamiento" type="date" value={form.fechaLanzamiento} onChange={parsearDatos} />

        <input name="compania" placeholder="Compañia" value={form.compania} onChange={parsearDatos} />

        <input
          name="plataformas"
          placeholder="Plataformas separadas por coma (PC, PS5...)"
          value={form.plataformas}
          onChange={parsearDatos}
        />

        <input
          name="categorias"
          placeholder="Categorias separadas por coma (Rol, Shooter...)"
          value={form.categorias}
          onChange={parsearDatos}
        />

        <input
          name="precio"
          type="number"
          step="0.01"
          placeholder="Precio"
          value={form.precio}
          onChange={parsearDatos}
        />

        <input name="urlImagen" placeholder="URL imagen" value={form.urlImagen} onChange={parsearDatos} />

        <input name="urlVideo" placeholder="URL video" value={form.urlVideo} onChange={parsearDatos} />

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Crear videojuego"}
        </button>
      </form>
    </section>
  );
};

export default NewGamePage;
