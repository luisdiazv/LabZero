import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { readAllDepartamento, deleteDepartamento } from "../../Ctrl/DepartamentoCtrl";
import { readAllPais } from "../../Ctrl/PaisCtrl";
import { readAllPersona } from "../../Ctrl/PersonaCtrl";

const Departamentos = () => {
  const [departamentos, setDepartamentos] = useState([]);
  const [nombresPais, setNombresPais] = useState({});
  const [nombresGobernador, setNombresGobernador] = useState({});
  const [cargando, setCargando] = useState(true);
  const [eliminando, setEliminando] = useState({});
  const navegar = useNavigate();

  useEffect(() => {
    const cargarDepartamentos = async () => {
      try {
        setCargando(true);
        const { data, error } = await readAllDepartamento();
        if (error) {
          console.error("Error al obtener departamentos:", error);
          alert("Hubo un problema al cargar los departamentos.");
        } else {
          setDepartamentos(data);

          const [paisesResponse, gobernadoresResponse] = await Promise.all([
            readAllPais(),
            readAllPersona()
          ]);

          const paises = {};
          const gobernadores = {};

          if (paisesResponse?.data) {
            paisesResponse.data.forEach((pais) => {
              paises[pais.id_pais] = pais.nombre;
            });
          }

          if (gobernadoresResponse?.data) {
            gobernadoresResponse.data.forEach((persona) => {
              gobernadores[persona.id_persona] = persona.nombre;
            });
          }

          setNombresPais(paises);
          setNombresGobernador(gobernadores);
        }
      } catch (err) {
        console.error("Error inesperado:", err);
        alert("Hubo un error al cargar los departamentos.");
      } finally {
        setCargando(false);
      }
    };

    cargarDepartamentos();
  }, []);

  const eliminarDepartamento = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este departamento? Esto puede afectar otros registros.")) {
      try {
        setEliminando((prev) => ({ ...prev, [id]: true }));
        const { error } = await deleteDepartamento(id);
        if (error) {
          console.error("Error al eliminar departamento:", error);
          alert("Hubo un problema al eliminar el departamento.");
        } else {
          setDepartamentos((prevDepartamentos) =>
            prevDepartamentos.filter((departamento) => departamento.id_departamento !== id)
          );
          alert("Departamento eliminado exitosamente.");
        }
      } catch (err) {
        console.error("Error inesperado:", err);
        alert("Hubo un error inesperado al eliminar el departamento.");
      } finally {
        setEliminando((prev) => ({ ...prev, [id]: false }));
      }
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h3>Aqui podras ver la información acerca de los departamentos.</h3>
      </div>


      {!cargando && (
        <div className="text-center">
          <button className="crear-btn" onClick={() => navegar("/departamentos/crear-departamento")}>
            Crear Departamento
          </button>
        </div>
      )}

      <div className="departamentos-list">
        {cargando ? (
          <p>Cargando departamentos...</p>
        ) : departamentos.length > 0 ? (
          departamentos.map((departamento) => (
            <div className="info-container">
              <div className="info-card" key={departamento.id_departamento}>
                <h2>{departamento.nombre}</h2>
                <div className="info-card-container">
                  <p><strong>Departamento ID: </strong> {departamento.id_departamento}</p>
                  <p><strong>País: </strong> {nombresPais[departamento.paisid] || "No asignado"}</p>
                  <p><strong>Gobernador: </strong> {nombresGobernador[departamento.gobernadorid] || "No asignado"}</p>
                </div>
              </div>
              <div className="info-buttons">
                <button className="modificar-btn" onClick={() => navegar(`/departamentos/modificar-departamento/${departamento.id_departamento}`)}>
                  Modificar
                </button>
                <button
                  className="eliminar-btn"
                  onClick={() => eliminarDepartamento(departamento.id_departamento)}
                  disabled={eliminando[departamento.id_departamento] || false}
                >
                  {eliminando[departamento.id_departamento] ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </div>

          ))
        ) : (
          <p>No hay departamentos disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default Departamentos;
