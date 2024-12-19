import "../Comun.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { readAllMunicipio, deleteMunicipio } from "../../Ctrl/MunicipioCtrl";
import { readAllDepartamento } from "../../Ctrl/DepartamentoCtrl";
import { readAllPersona } from "../../Ctrl/PersonaCtrl";

const Municipios = () => {
  const [municipios, setMunicipios] = useState([]);
  const [nombresDepartamento, setNombresDepartamento] = useState({});
  const [nombresAlcalde, setNombresAlcalde] = useState({});
  const [cargando, setCargando] = useState(true);
  const [eliminando, setEliminando] = useState({});
  const navegar = useNavigate();

  // Cargar los datos relacionados
  useEffect(() => {
    const cargarMunicipios = async () => {
      try {
        setCargando(true);
        const { data: municipiosData, error } = await readAllMunicipio();
        if (error) {
          console.error("Error al obtener municipios:", error);
          alert("Hubo un problema al cargar los municipios.");
        } else {
          setMunicipios(municipiosData);

          const [departamentosResponse, personasResponse] = await Promise.all([
            readAllDepartamento(),
            readAllPersona(),
          ]);

          const departamentos = {};
          const alcaldes = {};

          // Mapeo de nombres de departamentos
          if (departamentosResponse?.data) {
            departamentosResponse.data.forEach((departamento) => {
              departamentos[departamento.id_departamento] = departamento.nombre;
            });
          }

          // Mapeo de nombres de personas (alcaldes)
          if (personasResponse?.data) {
            personasResponse.data.forEach((persona) => {
              alcaldes[persona.id_persona] = persona.nombre;
            });
          }

          setNombresDepartamento(departamentos);
          setNombresAlcalde(alcaldes);
        }
      } catch (err) {
        console.error("Error inesperado:", err);
        alert("Hubo un error al cargar los municipios.");
      } finally {
        setCargando(false);
      }
    };

    cargarMunicipios();
  }, []);

  // Función para eliminar municipios
  const eliminarMunicipio = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este municipio?")) {
      try {
        setEliminando((prev) => ({ ...prev, [id]: true }));
        const { error } = await deleteMunicipio(id);
        if (error) {
          console.error("Error al eliminar municipio:", error);
          alert("Hubo un problema al eliminar el municipio.");
        } else {
          setMunicipios((prevMunicipios) =>
            prevMunicipios.filter((municipio) => municipio.id_municipio !== id)
          );
          alert("Municipio eliminado exitosamente.");
        }
      } catch (err) {
        console.error("Error inesperado:", err);
        alert("Hubo un error inesperado al eliminar el municipio.");
      } finally {
        setEliminando((prev) => ({ ...prev, [id]: false }));
      }
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h3>Aqui podras ver la información acerca de los municipios.</h3>
      </div>

      {!cargando && (
        <div className="text-center">
          <button className="crear-btn" onClick={() => navegar("/municipios/crear-municipio")}>
            Crear Municipio
          </button>
        </div>
      )}

      <div className="municipios-list">
        {cargando ? (
          <p>Cargando municipios...</p>
        ) : municipios.length > 0 ? (
          municipios.map((municipio) => (
            <div className="info-container">
              <div className="info-card" key={municipio.id_municipio}>
                <h2>{municipio.nombre}</h2>
                <div className="info-card-container">
                  <p><strong>ID Municipio:</strong> {municipio.id_municipio}</p>
                  <p><strong>Área:</strong> {municipio.area.toFixed(2)} km²</p>
                  <p><strong>Presupuesto:</strong> ${municipio.presupuesto > 1e18
                    ? municipio.presupuesto.toExponential(2)
                    : municipio.presupuesto.toLocaleString()}
                  </p>
                  <p><strong>Departamento:</strong> {nombresDepartamento[municipio.departamentoid] || "Sin asignar"}</p>
                  <p><strong>Alcalde:</strong> {nombresAlcalde[municipio.alcaldeid] || "Sin asignar"}</p>
                </div>
              </div>
              <div className="info-buttons">
                <button className="modificar-btn" onClick={() => navegar(`/municipios/modificar-municipio/${municipio.id_municipio}`)}>
                  Modificar
                </button>
                <button
                  className="eliminar-btn"
                  onClick={() => eliminarMunicipio(municipio.id_municipio)}
                  disabled={eliminando[municipio.id_municipio] || false}
                >
                  {eliminando[municipio.id_municipio] ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No hay municipios disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default Municipios;
