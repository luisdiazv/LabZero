import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { readPais, updatePais } from "../../Ctrl/PaisCtrl";
import { obtenerPersonasIDNombre } from "../../Ctrl/PersonaCtrl";

const ModificarPais = () => {
  const { id } = useParams();
  const [pais, setPais] = useState(null);
  const [personas, setPersonas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const navegar = useNavigate();

  useEffect(() => {
    const cargarPaisYPersonas = async () => {
      const { data: paisData, error: paisError } = await readPais(id);
      if (paisError) {
        alert("Error al cargar el país");
        navegar("/paises");
      } else {
        setPais(paisData[0]);
      }

      const { data: personasData, error: personasError } = await obtenerPersonasIDNombre();
      if (personasError) {
        console.error("Error al cargar las personas:", personasError);
        alert("Hubo un problema al cargar las personas.");
      } else {
        setPersonas(personasData);
      }
      setCargando(false);
    };

    cargarPaisYPersonas();
  }, [id, navegar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPais({ ...pais, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActualizando(true);
    const { data, error } = await updatePais(id, pais);
    if (error) {
      alert("Error al modificar el país");
    } else {
      alert(`País modificado exitosamente: ${data.nombre}`);
      navegar("/paises");
    }
    setActualizando(false);
  };

  if (cargando) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="container">
      <h1>Modificar País</h1>
      {pais && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del País"
            value={pais.nombre}
            onChange={handleChange}
            required
          />
          <select
            name="presidenteid"
            value={pais.presidenteid || ""}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Selecciona un presidente</option>
            {personas.map((persona) => (
              <option key={persona.id} value={persona.id}>
                {persona.nombre} (ID: {persona.id})
              </option>
            ))}
          </select>
          <div className="form-buttons-container">
            <button type="submit" disabled={actualizando} className="form-button create-button">
              {actualizando ? "Actualizando..." : "Actualizar País"}
            </button>
            <button type="button" onClick={() => navegar("/paises")} className="form-button cancel-button red-button">
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ModificarPais;
