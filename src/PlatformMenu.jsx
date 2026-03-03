const PlatformMenu = ({ plataformas, seleccionadas, onToggle }) => {
  return (
    <div className="menu-horizontal">
      {plataformas.map((plataforma) => (
        <label
          key={plataforma.id}
          className={`menu-item ${
            seleccionadas.includes(plataforma.nombre) ? "active" : ""
          }`}
        >
          <input
            type="checkbox"
            checked={seleccionadas.includes(plataforma.nombre)}
            onChange={() => onToggle(plataforma.nombre)}
          />
          {plataforma.nombre}
        </label>
      ))}
    </div>
  );
};

export default PlatformMenu;
