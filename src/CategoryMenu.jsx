const CategoryMenu = ({ categorias, seleccionadas, onToggle }) => {
  return (
    <div className="menu-horizontal">
      {categorias.map((categoria) => (
        <label
          key={categoria.id}
          className={`menu-item ${
            seleccionadas.includes(categoria.nombre) ? "active" : ""
          }`}
        >
          <input
            type="checkbox"
            checked={seleccionadas.includes(categoria.nombre)}
            onChange={() => onToggle(categoria.nombre)}
          />
          {categoria.nombre}
        </label>
      ))}
    </div>
  );
};

export default CategoryMenu;
