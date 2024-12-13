import "../Comun.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { readAllPersona, deletePersona, readPersona } from "../../Ctrl/PersonaCtrl";

const Personas = () => {

  const [personas, setPersonas] = useState([]);
  const [nombresCabeza, setNombresCabeza] = useState({});
  const [cargando, setCargando] = useState(true);
  const [eliminando, setEliminando] = useState({});
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

          const idsCabezas = data
            .filter((persona) => persona.cabezafamilia)
            .map((persona) => persona.cabezafamilia);

          const nombres = {};
          await Promise.all(
            idsCabezas.map(async (id) => {
              const { data: personaData, error: errorPersona } = await readPersona(id);
              if (errorPersona) {
                console.error(`Error al obtener cabeza de familia con ID ${id}:`, errorPersona);
              } else if (personaData && personaData.length > 0) {
                nombres[id] = personaData[0].nombre;
              }
            })
          );
          setNombresCabeza(nombres);
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
        setEliminando((prev) => ({ ...prev, [id]: true }));
        const { error } = await deletePersona(id);
        if (error) {
          console.error("Error al eliminar persona:", error);
          alert("Hubo un problema al eliminar la persona.");
        } else {
          setPersonas(personas.filter((persona) => persona.id_persona !== id));
          alert("Persona eliminada exitosamente.");
        }
      } catch (err) {
        console.error("Error inesperado:", err);
        alert("Hubo un error inesperado al eliminar la persona.");
      } finally {
        setEliminando((prev) => ({ ...prev, [id]: false }));
      }
    }
  };

  return (
    <div className="container">
      <div className="header text-center">
        <h1>CRUD</h1>
        <h1>Personas</h1>
      </div>

      <div className="button-container text-center">
        <button className="inicio-btn" onClick={() => navegar("/")}>Inicio</button>
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
            <div className="info-card" key={persona.id_persona}>
              <h2>{persona.nombre}</h2>
              {/*<p><strong>Documento Identidad:</strong> {persona.documentoidentidad}</p>*/}
              <p><strong>Teléfono:</strong> {persona.telefono}</p>
              <p><strong>Edad:</strong> {persona.edad}</p>
              <p><strong>Sexo:</strong> {persona.sexo}</p>
              <p>
                <strong>Cabeza de Familia:</strong>{" "}
                {persona.cabezafamilia ? (
                  `${nombresCabeza[persona.cabezafamilia]} (ID: ${persona.cabezafamilia})`
                ) : (
                  "No aplica"
                )}
              </p>

              <div className="info-buttons">
                <button className="modificar-btn" onClick={() => navegar(`/modificar-persona/${persona.id_persona}`)}>
                  Modificar
                </button>
                <button
                  className="eliminar-btn"
                  onClick={() => eliminarPersona(persona.id_persona)}
                  disabled={eliminando[persona.id_persona] || false}
                >
                  {eliminando[persona.id_persona] ? "Eliminando..." : "Eliminar"}
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
