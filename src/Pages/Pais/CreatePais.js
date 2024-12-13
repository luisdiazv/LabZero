import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPais } from "../../Ctrl/PaisCtrl";

const CrearPais = () => {
  const [pais, setPais] = useState({
    nombre: "",
    presidenteID: null,
  });
  const [cargando, setCargando] = useState(false);
  const navegar = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPais({ ...pais, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    const { data, error } = await createPais(pais);
    if (error) {
      alert("Error al crear el país");
    } else {
      alert(`País creado exitosamente: ${data.nombre}`);
      navegar("/paises");
    }
    setCargando(false);
  };

  return (
    <div className="container">
      <h1>Crear País</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del País"
          value={pais.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="presidenteID"
          placeholder="ID del Presidente"
          value={pais.presidenteID}
          onChange={handleChange}
        />
        <button type="submit" disabled={cargando}>
          {cargando ? "Creando..." : "Crear País"}
        </button>
      </form>
    </div>
  );
};

export default CrearPais;
