import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { readPais, updatePais } from "../../Ctrl/PaisCtrl";
import { obtenerPersonasIDNombre } from "../../Ctrl/PersonaCtrl";

const ModificarPais = () => {
  const { id } = useParams();
  const [pais, setPais] = useState(null);
  const [personas, setPersonas] = useState([]); // Para almacenar las personas
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const navegar = useNavigate();

  useEffect(() => {
    const cargarPaisYPersonas = async () => {
      // Cargar el país
      const { data: paisData, error: paisError } = await readPais(id);
      if (paisError) {
        alert("Error al cargar el país");
        navegar("/paises");
      } else {
        setPais(paisData[0]);
      }

      // Cargar las personas para el select
      const { data: personasData, error: personasError } = await obtenerPersonasIDNombre();
      if (personasError) {
        console.error("Error al cargar las personas:", personasError);
        alert("Hubo un problema al cargar las personas.");
      } else {
        setPersonas(personasData); // Guardamos las personas
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
            name="presidenteID"
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
          <button type="submit" disabled={actualizando}>
            {actualizando ? "Actualizando..." : "Actualizar País"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ModificarPais;
