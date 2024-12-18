import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { readMunicipio, updateMunicipio, readAllPersona } from "../../Ctrl/MunicipioCtrl";
import readAllDepartamento
import "../Comun.css";

const ModificarMunicipio = () => {
  const { id } = useParams();
  const [municipio, setMunicipio] = useState(null);
  const [departamentos, setDepartamentos] = useState([]);
  const [alcaldes, setAlcaldes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [areaError, setAreaError] = useState("");
  const [presupuestoError, setPresupuestoError] = useState("");
  const navegar = useNavigate();

  useEffect(() => {
    const cargarMunicipio = async () => {
      try {
        const { data, error } = await readMunicipio(id);
        if (error) {
          console.error("Error al cargar municipio:", error);
          alert("Hubo un problema al cargar los datos del municipio.");
          navegar("/municipios");
        } else {
          setMunicipio(data[0]);
        }
      } catch (err) {
        console.error("Error inesperado:", err);
        alert("Hubo un error al cargar los datos del municipio.");
        navegar("/municipios");
      } finally {
        setCargando(false);
      }
    };

    const cargarDepartamentos = async () => {
      try {
        const { data, error } = await readAllDepartamento();
        if (error) {
          console.error("Error al obtener departamentos:", error);
          alert("Hubo un problema al cargar los departamentos.");
        } else {
          setDepartamentos(data);
        }
      } catch (err) {
        console.error("Error inesperado:", err);
        alert("Hubo un error al cargar los departamentos.");
      }
    };

    const cargarAlcaldes = async () => {
      try {
        const { data, error } = await readAllPersona();
        if (error) {
          console.error("Error al obtener personas:", error);
          alert("Hubo un problema al cargar las personas.");
        } else {
          setAlcaldes(data.filter((persona) => persona.sexo)); // Filtra personas con sexo definido
        }
      } catch (err) {
        console.error("Error inesperado:", err);
        alert("Hubo un error al cargar las personas.");
      }
    };

    cargarMunicipio();
    cargarDepartamentos();
    cargarAlcaldes();
  }, [id, navegar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMunicipio({ ...municipio, [name]: value });

    if (name === "area") {
      if (value <= 0 || isNaN(value)) {
        setAreaError("El área debe ser un número mayor que 0.");
      } else {
        setAreaError("");
      }
    }

    if (name === "presupuesto") {
      if (value <= 0 || isNaN(value)) {
        setPresupuestoError("El presupuesto debe ser un número mayor que 0.");
      } else {
        setPresupuestoError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (areaError || municipio.area <= 0 || municipio.area === "") {
      setAreaError("El área debe ser un número mayor que 0.");
      return; // No continuar si hay un error en el área
    }

    if (presupuestoError || municipio.presupuesto <= 0 || municipio.presupuesto === "") {
      setPresupuestoError("El presupuesto debe ser un número mayor que 0.");
      return; // No continuar si hay un error en el presupuesto
    }

    setActualizando(true);
    try {
      const { error } = await updateMunicipio(id, municipio);
      if (error) {
        console.error("Error al modificar municipio:", error);
        alert("Hubo un problema al modificar el municipio.");
      } else {
        alert("Municipio modificado exitosamente.");
        navegar("/municipios");
      }
    } catch (err) {
      console.error("Error inesperado:", err);
      alert("Hubo un error inesperado al modificar el municipio.");
    } finally {
      setActualizando(false);
    }
  };

  if (cargando) {
    return <p className="loading-text">Cargando datos...</p>;
  }

  return (
    <div className="container">
      <h1 className="form-title">Modificar Municipio</h1>
      {municipio && (
        <form className="crud-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del Municipio"
            value={municipio.nombre}
            onChange={handleChange}
            required
            className="form-input"
          />
          <input
            type="number"
            name="area"
            placeholder="Área"
            value={municipio.area}
            onChange={handleChange}
            required
            className="form-input"
          />
          {areaError && <p className="error-message">{areaError}</p>}
          <input
            type="number"
            name="presupuesto"
            placeholder="Presupuesto"
            value={municipio.presupuesto}
            onChange={handleChange}
            required
            className="form-input"
          />
          {presupuestoError && <p className="error-message">{presupuestoError}</p>}

          <select
            name="DepartamentoID"
            value={municipio.DepartamentoID}
            onChange={handleChange}
            required
            className="form-select"
          >
            <option value="">Seleccionar Departamento</option>
            {departamentos.map((departamento) => (
              <option key={departamento.id_departamento} value={departamento.id_departamento}>
                {departamento.nombre} (ID: {departamento.id_departamento})
              </option>
            ))}
          </select>

          <select
            name="alcaldeID"
            value={municipio.alcaldeID}
            onChange={handleChange}
            className="form-select"
          >
            <option value={null}>Seleccionar Alcalde (opcional)</option>
            {alcaldes.map((alcalde) => (
              <option key={alcalde.id_persona} value={alcalde.id_persona}>
                {alcalde.nombre} (ID: {alcalde.id_persona})
              </option>
            ))}
          </select>

          {/* Botones en la misma línea */}
          <div className="form-buttons">
            <button
              type="submit"
              disabled={actualizando}
              className="form-button form-button-small"
            >
              {actualizando ? "Actualizando..." : "Actualizar"}
            </button>
            <button type="button" onClick={() => navegar("/municipios")} className="form-button cancel-button red-button">
              Cancelar y volver
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ModificarMunicipio;
