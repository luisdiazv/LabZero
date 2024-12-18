import "../Comun.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { readAllPropiedadVivienda, deletePropiedadVivienda } from "../../Ctrl/PropiedadViviendaCtrl";
import { readAllPersona } from "../../Ctrl/PersonaCtrl";
import { readAllVivienda } from "../../Ctrl/ViviendaCtrl";

const PropiedadVivienda = () => {
  const [propiedades, setPropiedades] = useState([]);
  const [personas, setPersonas] = useState({});
  const [viviendas, setViviendas] = useState({});
  const [cargando, setCargando] = useState(true);
  const navegar = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);

        // Cargar propiedades de vivienda
        const { data: propiedadesData, error: errorPropiedades } = await readAllPropiedadVivienda();
        if (errorPropiedades) {
          console.error("Error al obtener propiedades de vivienda:", errorPropiedades);
          alert("Hubo un problema al cargar las propiedades de vivienda.");
          return;
        }

        // Cargar personas
        const { data: personasData, error: errorPersonas } = await readAllPersona();
        if (errorPersonas) {
          console.error("Error al obtener personas:", errorPersonas);
          alert("Hubo un problema al cargar las personas.");
          return;
        }

        // Cargar viviendas
        const { data: viviendasData, error: errorViviendas } = await readAllVivienda();
        if (errorViviendas) {
          console.error("Error al obtener viviendas:", errorViviendas);
          alert("Hubo un problema al cargar las viviendas.");
          return;
        }

        // Transformar las personas y viviendas en diccionarios para acceso rápido
        const personasDict = personasData.reduce((acc, persona) => {
          acc[persona.id_persona] = persona.nombre;
          return acc;
        }, {});

        const viviendasDict = viviendasData.reduce((acc, vivienda) => {
          acc[vivienda.id_vivienda] = vivienda.direccion;
          return acc;
        }, {});

        // Actualizar estados
        setPropiedades(propiedadesData);
        setPersonas(personasDict);
        setViviendas(viviendasDict);
      } catch (err) {
        console.error("Error inesperado:", err);
        alert("Hubo un error al cargar los datos.");
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  const handleDelete = async (id) => {
    try {
      // Llamar a la función de eliminación
      const { data, error } = await deletePropiedadVivienda(id);
      console.log("Respuesta de eliminación:", data); // Ver respuesta de la API
      if (error) {
        console.error("Error al eliminar propiedad de vivienda:", error);
        alert("Hubo un problema al eliminar la propiedad de vivienda.");
        return;
      }

      // Eliminar la propiedad de vivienda de la UI (actualizando el estado)
      setPropiedades((prevPropiedades) =>
        prevPropiedades.filter((propiedad) => propiedad.id_propiedad_vivienda !== id)
      );

      // Mostrar un mensaje de éxito
      alert("Propiedad de vivienda eliminada exitosamente.");
    } catch (err) {
      console.error("Error inesperado en eliminación:", err);
      alert("Hubo un error inesperado al intentar eliminar la propiedad de vivienda.");
    }
  };

  return (
    <div className="container">
      <div className="header text-center">
        <h1>CRUD</h1>
        <h1>Propiedades de Vivienda</h1>
      </div>

      <div className="button-container text-center">
        <button className="inicio-btn" onClick={() => navegar("/")}>Inicio</button>
        <button id="Personas" onClick={() => navegar("/personas")}>Personas</button>
        <button id="Vivienda" onClick={() => navegar("/vivienda")}>Vivienda</button>
        <button id="Propiedad de Vivienda" onClick={() => navegar("/propiedad-vivienda")}>Propiedad de Vivienda</button>
        <button id="Residencia" onClick={() => navegar("/")}>Residencia</button>
        <button id="Municipios" onClick={() => navegar("/")}>Municipios</button>
        <button id="Departamentos" onClick={() => navegar("/")}>Departamentos</button>
        <button id="Paises" onClick={() => navegar("/paises")}>Paises</button>
      </div>

      {!cargando && (
        <div className="text-center">
          <button className="crear-btn" onClick={() => navegar("/propiedad-vivienda/crear-propiedad-vivienda")}>
            Crear Propiedad
          </button>
        </div>
      )}

      <div className="paises-list">
        {cargando ? (
          <p>Cargando propiedades de vivienda...</p>
        ) : propiedades.length > 0 ? (
          propiedades.map((propiedad) => (
            <div className="info-card" key={propiedad.id_propiedad_vivienda}>
              <h2>Propiedad ID: {propiedad.id_propiedad_vivienda}</h2>
              <p><strong>Vivienda: </strong> {viviendas[propiedad.viviendaid] || "Desconocida"} (ID: {propiedad.viviendaid})</p>
              <p>
                <strong>Propietaria:</strong>{" "}
                {personas[propiedad.propietariaid] || "Desconocido"} (ID: {propiedad.propietariaid})
              </p>

              <div className="info-buttons">
                <button className="modificar-btn" onClick={() => navegar(`/propiedad-vivienda/modificar-propiedad-vivienda/${propiedad.id_propiedad_vivienda}`)}>
                  Modificar
                </button>
                <button
                  className="eliminar-btn"
                  onClick={() => handleDelete(propiedad.id_propiedad_vivienda)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No hay propiedades de vivienda disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default PropiedadVivienda;
