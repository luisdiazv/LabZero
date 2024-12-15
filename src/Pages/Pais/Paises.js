import "../Comun.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { readAllPais, deletePais } from "../../Ctrl/PaisCtrl"; 

const Paises = () => {
  const [paises, setPaises] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navegar = useNavigate();

  useEffect(() => {
    const cargarPaises = async () => {
      try {
        setCargando(true);
        const { data, error } = await readAllPais();
        if (error) {
          console.error("Error al obtener países:", error);
          alert("Hubo un problema al cargar los países.");
        } else {
          setPaises(data);
        }
      } catch (err) {
        console.error("Error inesperado:", err);
        alert("Hubo un error al cargar los países.");
      } finally {
        setCargando(false);
      }
    };

    cargarPaises();
  }, []);

  return (
    <div className="container">
      <div className="header text-center">
        <h1>CRUD</h1>
        <h1>Países</h1>
      </div>

      <div className="button-container text-center">
        <button className="inicio-btn" onClick={() => navegar("/")}>Inicio</button>
        <button onClick={() => navegar("/paises")}>Países</button>
        <button onClick={() => navegar("/personas")}>Personas</button>
        <button onClick={() => navegar("/viviendas")}>Viviendas</button>
        <button onClick={() => navegar("/municipios")}>Municipios</button>
        <button onClick={() => navegar("/propVivienda")}>Propiedad de Vivienda</button>
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
              <p><strong>Presidente:</strong> {pais.presidente}</p>

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
