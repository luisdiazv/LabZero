import "./Comun.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../API/client";

const Personas = () => {
  const [personas, setPersonas] = useState([]);
  const navegar = useNavigate();

  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const { data, error } = await supabase.from("persona").select("*");
        if (error) {
          console.error("Error al obtener personas:", error);
        } else {
          setPersonas(data);
        }
      } catch (err) {
        console.error("Error inesperado:", err);
      }
    };

    fetchPersonas();
  }, []);

  const eliminarPersona = async (id) => {
    window.confirm("¿Estás seguro de que deseas eliminar esta persona?");
  
    try {
      const { error } = await supabase.from("persona").delete().eq("id", id);
  
      if (error) {
        console.error("Error al eliminar persona:", error);
        alert("Hubo un error al eliminar la persona.");
      } else {
        setPersonas(personas.filter(persona => persona.id !== id));
      }
    } catch (err) {
      console.error("Error inesperado:", err);
      alert("Hubo un error inesperado al eliminar la persona.");
    }
  };  

  return (
    <div className="container">
      <div className="header text-center">
        <h1>CRUD</h1>
      </div>
      <div className="button-container text-center">
        <button id="Home" onClick={() => navegar("/")}>Inicio</button>
        <button id="Personas" onClick={() => navegar("/personas")}>Personas</button>
        <button id="Viviendas">Viviendas</button>
        <button id="Municipios">Municipios</button>
        <button id="Propiedad de Vivienda">Propiedad de Vivienda</button>
      </div>

      <div className="text-center">
        <button className="crear-btn" onClick={() => navegar("/crear-persona")}
        >Crear Persona</button>
      </div>

      <div className="personas-list">
        {personas.length > 0 ? (
          personas.map(persona => (
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
                <button 
                  className="modificar-btn" 
                  onClick={() => navegar(`/editar-persona/${persona.id}`)}
                >
                  Modificar
                </button>
                <button 
                  className="eliminar-btn" 
                  onClick={() => eliminarPersona(persona.id)}
                >
                  Eliminar
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
