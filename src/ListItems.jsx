import { useEffect, useState } from "react";
import { fetchAPI, deleteAPI } from "./apiService";
import CategoryMenu from "./CategoryMenu";
import PlatformMenu from "./PlatformMenu";
import ItemCard from "./ItemCard";
import VideoGameDetail from "./VideoGameDetail";

const ListItems = () => {
  const [videojuegos, setVideojuegos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [plataformas, setPlataformas] = useState([]);

  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [plataformasSeleccionadas, setPlataformasSeleccionadas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [videojuegoSeleccionado, setVideojuegoSeleccionado] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const dataVideojuegos = await fetchAPI("http://localhost:3001/videojuegos");
      const dataCategorias = await fetchAPI("http://localhost:3001/categorias");
      const dataPlataformas = await fetchAPI("http://localhost:3001/plataformas");

      setVideojuegos(dataVideojuegos);
      setCategorias(dataCategorias);
      setPlataformas(dataPlataformas);

      setCategoriasSeleccionadas([]);
      setPlataformasSeleccionadas([]);
    };

    loadData();
  }, []);

  const toggleCategoria = (nombreCategoria) => {
    if (categoriasSeleccionadas.includes(nombreCategoria)) {
      setCategoriasSeleccionadas(
        categoriasSeleccionadas.filter((categoria) => categoria !== nombreCategoria)
      );
    } else {
      setCategoriasSeleccionadas([...categoriasSeleccionadas, nombreCategoria]);
    }
  };

  const togglePlataforma = (nombrePlataforma) => {
    if (plataformasSeleccionadas.includes(nombrePlataforma)) {
      setPlataformasSeleccionadas(
        plataformasSeleccionadas.filter((plataforma) => plataforma !== nombrePlataforma)
      );
    } else {
      setPlataformasSeleccionadas([...plataformasSeleccionadas, nombrePlataforma]);
    }
  };

  const handleDelete = async (id) => {
    await deleteAPI(`http://localhost:3001/videojuegos/${id}`);
    setVideojuegos((prev) => prev.filter((item) => item.id !== id));
    setVideojuegoSeleccionado((prev) => (prev && prev.id === id ? null : prev));
  };

  const videojuegosFiltrados = videojuegos.filter((videojuego) => {
    const coincideCategoria =
      categoriasSeleccionadas.length === 0 ||
      videojuego.categorias.some((categoria) =>
        categoriasSeleccionadas.includes(categoria)
      );

    const coincidePlataforma =
      plataformasSeleccionadas.length === 0 ||
      videojuego.plataformas.some((plataforma) =>
        plataformasSeleccionadas.includes(plataforma)
      );

    const texto = busqueda.toLowerCase();
    const coincideBusqueda =
      videojuego.nombre.toLowerCase().includes(texto) ||
      videojuego.descripcion.toLowerCase().includes(texto);

    return coincideCategoria && coincidePlataforma && coincideBusqueda;
  });

  return (
    <>
      <section className="filtros-panel">
        <h4>Categorias</h4>
        <CategoryMenu
          categorias={categorias}
          seleccionadas={categoriasSeleccionadas}
          onToggle={toggleCategoria}
        />

        <h4>Plataformas</h4>
        <PlatformMenu
          plataformas={plataformas}
          seleccionadas={plataformasSeleccionadas}
          onToggle={togglePlataforma}
        />
      </section>

      <section className="busqueda-box">
        <label htmlFor="busqueda">Buscar por nombre o descripcion</label>
        <input
          id="busqueda"
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Escribe para buscar..."
        />
      </section>

      <h4>
        Listado <span className="contador">({videojuegosFiltrados.length})</span>
      </h4>
      <div className="grid-videojuegos">
        {videojuegosFiltrados.map((videojuego) => (
          <ItemCard
            key={videojuego.id}
            videojuego={videojuego}
            onSelect={setVideojuegoSeleccionado}
          />
        ))}
      </div>

      <VideoGameDetail
        videojuego={videojuegoSeleccionado}
        onClose={() => setVideojuegoSeleccionado(null)}
        onDelete={handleDelete}
      />
    </>
  );
};

export default ListItems;
