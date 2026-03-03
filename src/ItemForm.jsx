import { useEffect, useState } from "react";
import fetchAPI, { editAPI } from "./apiService";

const emptyItem = {
  marca: "",
  modelo: "",
  tipo: "sedan",
  combustible: "gasolina",
  urlImagen: "",
  decada: "90s",
};

const TIPOS = ["sedan", "coupe", "pedrosa", "suv", "descapotable"];
const DECADAS = ["60s", "70s", "80s", "90s", "00s", "10s", "20s"];

const ItemForm = ({ itemId, onCancel, onSaved }) => {
  const [form, setForm] = useState(emptyItem);

  useEffect(() => {
    const loadItem = async () => {
      if (!itemId) return;
      const item = await fetchAPI(`http://localhost:3001/coches/${itemId}`);
      setForm(item);
    };
    loadItem();
  }, [itemId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updated = await editAPI(
      `http://localhost:3001/coches/${itemId}`,
      { ...form, id: itemId }
    );

    onSaved(updated);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="marca"
        value={form.marca}
        onChange={handleChange}
        placeholder="Marca"
      />

      <input
        name="modelo"
        value={form.modelo}
        onChange={handleChange}
        placeholder="Modelo"
      />

      <select name="tipo" value={form.tipo} onChange={handleChange}>
        {TIPOS.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <select name="combustible" value={form.combustible} onChange={handleChange}>
        <option value="gasolina">gasolina</option>
        <option value="diesel">diesel</option>
        <option value="hibrido">hibrido</option>
        <option value="electrico">electrico</option>
      </select>

      <input
        name="urlImagen"
        value={form.urlImagen}
        onChange={handleChange}
        placeholder="URL imagen"
      />

      <select name="decada" value={form.decada} onChange={handleChange}>
        {DECADAS.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      <button type="submit">GUARDAR</button>
      <button type="button" onClick={onCancel}>CANCELAR</button>
    </form>
  );
};

export default ItemForm;
