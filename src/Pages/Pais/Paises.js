import "../Comun.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { readAllPais, deletePais } from "../../Ctrl/PaisCtrl"; 
import { readAllPersona } from "../../Ctrl/PersonaCtrl";

const Paises = () => {
  const [paises, setPaises] = useState([]);
  const [personas, setPersonas] = useState({});
  const [cargando, setCargando] = useState(true);
  const navegar = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);

        // Cargar países
        const { data: paisesData, error: errorPaises } = await readAllPais();
        if (errorPaises) {
          console.error("Error al obtener países:", errorPaises);
          alert("Hubo un problema al cargar los países.");
          return;
        }

        // Cargar personas
        const { data: personasData, error: errorPersonas } = await readAllPersona();
        if (errorPersonas) {
          console.error("Error al obtener personas:", errorPersonas);
          alert("Hubo un problema al cargar las personas.");
          return;
        }

        // Transformar las personas en un diccionario para acceso rápido
        const personasDict = personasData.reduce((acc, persona) => {
          acc[persona.id_persona] = persona.nombre;
          return acc;
        }, {});

        // Actualizar estados
        setPaises(paisesData);
        setPersonas(personasDict);
      } catch (err) {
        console.error("Error inesperado:", err);
        alert("Hubo un error al cargar los datos.");
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  return (
    <div className="container">
      <div className="header text-center">
        <h1>CRUD</h1>
        <h1>Países</h1>
      </div>

      <div className="button-container text-center">
        <button className="inicio-btn" onClick={() => navegar("/")}>Inicio</button>
        <button id="Personas" onClick={() => navegar("/personas")}>Personas</button>
        <button id="Vivienda" onClick={() => navegar("/")}>Vivienda</button>
        <button id="Propiedad de Vivienda" onClick={() => navegar("/")}>Propiedad de Vivienda</button>
        <button id="Residencia" onClick={() => navegar("/")}>Residencia</button>
        <button id="Municipios" onClick={() => navegar("/")}>Municipios</button>
        <button id="Departamentos" onClick={() => navegar("/")}>Departamentos</button>
        <button id="Paises" onClick={() => navegar("/paises")}>Paises</button>
      </div>

      {!cargando && (
        <div className="text-center">
          <button className="crear-btn" onClick={() => navegar("/paises/crear-pais")}>
            Crear País
          </button>
        </div>
      )}

      <div className="paises-list">
        {cargando ? (
          <p>Cargando países...</p>
        ) : paises.length > 0 ? (
          paises.map((pais) => (
            <div className="info-card" key={pais.id_pais}>
              <h2>{pais.nombre}</h2>
              <p><strong>Pais ID: </strong> {pais.id_pais}</p>
              <p>
                <strong>Presidente:</strong>{" "}
                {personas[pais.presidenteid] || "Desconocido"} (ID: {pais.presidenteid})
              </p>

              <div className="info-buttons">
                <button className="modificar-btn" onClick={() => navegar(`/paises/modificar-pais/${pais.id_pais}`)}>
                  Modificar
                </button>
                <button
                  className="eliminar-btn"
                  onClick={() => deletePais(pais.id_pais)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No hay países disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default Paises;
