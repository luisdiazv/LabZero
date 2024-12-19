import "../Comun.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { readAllPais, deletePais } from "../../Ctrl/PaisCtrl";
import { readAllPersona } from "../../Ctrl/PersonaCtrl";

const Paises = () => {
  const [paises, setPaises] = useState([]);
  const [nombresPresidente, setNombresPresidente] = useState({});
  const [cargando, setCargando] = useState(true);
  const [eliminando, setEliminando] = useState({});
  const navegar = useNavigate();

  // Cargar los datos relacionados
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);
        const { data: paisesData, error } = await readAllPais();
        if (error) {
          console.error("Error al obtener países:", error);
          alert("Hubo un problema al cargar los países.");
        } else {
          setPaises(paisesData);

          const personasResponse = await readAllPersona();
          const presidentes = {};

          // Mapeo de nombres de personas (presidentes)
          if (personasResponse?.data) {
            personasResponse.data.forEach((persona) => {
              presidentes[persona.id_persona] = persona.nombre;
            });
          }

          setNombresPresidente(presidentes);
        }
      } catch (err) {
        console.error("Error inesperado:", err);
        alert("Hubo un error al cargar los países.");
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  // Función para eliminar países
  const eliminarPais = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este país?")) {
      try {
        setEliminando((prev) => ({ ...prev, [id]: true }));
        const { error } = await deletePais(id);
        if (error) {
          console.error("Error al eliminar país:", error);
          alert("Hubo un problema al eliminar el país.");
        } else {
          setPaises((prevPaises) =>
            prevPaises.filter((pais) => pais.id_pais !== id)
          );
          alert("País eliminado exitosamente.");
        }
      } catch (err) {
        console.error("Error inesperado:", err);
        alert("Hubo un error inesperado al eliminar el país.");
      } finally {
        setEliminando((prev) => ({ ...prev, [id]: false }));
      }
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h3>Aquí podrás ver la información acerca de los países.</h3>
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
            <div className="info-container" key={pais.id_pais}>
              <div className="info-card">
                <h2>{pais.nombre}</h2>
                <div className="info-card-container">
                  <p><strong>ID País:</strong> {pais.id_pais}</p>
                  <p><strong>Presidente:</strong> {nombresPresidente[pais.presidenteid] || "Sin asignar"}</p>
                </div>
              </div>
              <div className="info-buttons">
                <button className="modificar-btn" onClick={() => navegar(`/paises/modificar-pais/${pais.id_pais}`)}>
                  Modificar
                </button>
                <button
                  className="eliminar-btn"
                  onClick={() => eliminarPais(pais.id_pais)}
                  disabled={eliminando[pais.id_pais] || false}
                >
                  {eliminando[pais.id_pais] ? "Eliminando..." : "Eliminar"}
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
