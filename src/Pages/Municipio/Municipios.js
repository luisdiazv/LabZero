import "../Comun.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { readAllMunicipio, deleteMunicipio } from "../../Ctrl/MunicipioCtrl";

const Municipios = () => {
  const [municipios, setMunicipios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [eliminando, setEliminando] = useState({});
  const navegar = useNavigate();

  // Cargar los municipios
  useEffect(() => {
    const cargarMunicipios = async () => {
      try {
        setCargando(true);
        const { data, error } = await readAllMunicipio();
        if (error) {
          console.error("Error al obtener municipios:", error);
          alert("Hubo un problema al cargar los municipios.");
        } else {
          setMunicipios(data);
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

  // Eliminar un municipio
  const eliminarMunicipio = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este municipio?")) {
      try {
        setEliminando((prev) => ({ ...prev, [id]: true }));
        const { error } = await deleteMunicipio(id);
        if (error) {
          console.error("Error al eliminar municipio:", error);
          alert("Hubo un problema al eliminar el municipio.");
        } else {
          setMunicipios(municipios.filter((municipio) => municipio.id_municipio !== id));
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
      <div className="header text-center">
        <h1>CRUD</h1>
        <h1>Municipios</h1>
      </div>

      <div className="button-container text-center">
        <button className="inicio-btn" onClick={() => navegar("/")}>Inicio</button>
        <button id="Municipios" onClick={() => navegar("/municipios")}>Municipios</button>
        <button id="Departamentos" onClick={() => navegar("/")}>Departamentos</button>
        <button id="Paises" onClick={() => navegar("/paises")}>Paises</button>
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
            <div className="info-card" key={municipio.id_municipio}>
              <h2>{municipio.nombre}</h2>
              <p><strong>Municipio ID: </strong> {municipio.id_municipio}</p>
              <p><strong>Código:</strong> {municipio.codigo}</p>
              <p><strong>Departamento:</strong> {municipio.departamento}</p>
              <p><strong>Pais:</strong> {municipio.pais}</p>

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
