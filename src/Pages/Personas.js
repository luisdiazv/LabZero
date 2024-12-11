import "./Comun.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { readAllPersona, deletePersona } from "../Ctrl/PersonaCtrl";

const Personas = () => {
  const [personas, setPersonas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [eliminando, setEliminando] = useState({}); // Cambié el estado para manejarlo por persona
  const navegar = useNavigate();

  useEffect(() => {
    const cargarPersonas = async () => {
      try {
        setCargando(true);
        const { data, error } = await readAllPersona();
        if (error) {
          console.error("Error al obtener personas:", error);
          alert("Hubo un problema al cargar las personas.");
        } else {
          setPersonas(data);
        }
      } catch (err) {
        console.error("Error inesperado:", err);
        alert("Hubo un error al cargar las personas.");
      } finally {
        setCargando(false);
      }
    };

    cargarPersonas();
  }, []);

  const eliminarPersona = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta persona?")) {
      try {
        setEliminando((prev) => ({ ...prev, [id]: true })); // Setea el estado de la persona eliminada como 'true'
        const { error } = await deletePersona(id);
        if (error) {
          console.error("Error al eliminar persona:", error);
          alert("Hubo un problema al eliminar la persona.");
        } else {
          setPersonas(personas.filter((persona) => persona.id !== id));
          alert("Persona eliminada exitosamente.");
        }
      } catch (err) {
        console.error("Error inesperado:", err);
        alert("Hubo un error inesperado al eliminar la persona.");
      } finally {
        setEliminando((prev) => ({ ...prev, [id]: false })); // Restaura el estado de 'eliminando' después de la eliminación
      }
    }
  };

  return (
    <div className="container">
      <div className="header text-center">
        <h1>CRUD</h1>
      </div>
      <div className="button-container text-center">
        <button onClick={() => navegar("/")}>Inicio</button>
        <button onClick={() => navegar("/personas")}>Personas</button>
        <button onClick={() => navegar("/viviendas")}>Viviendas</button>
        <button onClick={() => navegar("/municipios")}>Municipios</button>
        <button onClick={() => navegar("/propVivienda")}>Propiedad de Vivienda</button>
      </div>

      {!cargando && (
        <div className="text-center">
          <button className="crear-btn" onClick={() => navegar("/crear-persona")}>
            Crear Persona
          </button>
        </div>
      )}

      <div className="personas-list">
        {cargando ? (
          <p>Cargando personas...</p>
        ) : personas.length > 0 ? (
          personas.map((persona) => (
            <div className="info-card" key={persona.id}>
              <h3>{persona.nombre}</h3>
              <p><strong>Teléfono:</strong> {persona.telefono}</p>
              <p><strong>Edad:</strong> {persona.edad}</p>
              <p><strong>Sexo:</strong> {persona.sexo}</p>
              <p><strong>ID Vivienda:</strong> {persona.vivienda_id_viv}</p>
              <p><strong>ID Persona DI-IV:</strong> {persona.persona_di_iv}</p>
              <p><strong>ID Municipio:</strong> {persona.municipio_id_mun}</p>
              <p><strong>ID Persona Padre:</strong> {persona.parent_persona_id}</p>

              <div className="info-buttons">
                <button className="modificar-btn" onClick={() => navegar(`/editar-persona/${persona.id}`)}>
                  Modificar
                </button>
                <button 
                  className="eliminar-btn" 
                  onClick={() => eliminarPersona(persona.id)}
                  disabled={eliminando[persona.id] || false} // Desactiva el botón solo si la persona está siendo eliminada
                >
                  {eliminando[persona.id] ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No hay personas disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default Personas;
