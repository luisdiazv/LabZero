import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { readMunicipio, updateMunicipio } from "../../Ctrl/MunicipioCtrl";
import { readAllDepartamento } from "../../Ctrl/DepartamentoCtrl";
import { readAllPersona } from "../../Ctrl/PersonaCtrl";
import "../Comun.css";

const ModificarMunicipio = () => {
  const { id } = useParams();
  const [municipio, setMunicipio] = useState(null);
  const [departamentos, setDepartamentos] = useState([]);
  const [alcaldes, setAlcaldes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [nombreError, setNombreError] = useState("");
  const [areaError, setAreaError] = useState("");
  const [presupuestoError, setPresupuestoError] = useState("");
  const navegar = useNavigate();

  // Cargar datos iniciales
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
          setAlcaldes(data);
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

  // Funciones de validación
  const validarNombre = (nombre) => {
    if (nombre.length < 3) return "El nombre debe tener al menos 3 caracteres.";
    return "";
  };

  const validarNumero = (valor, campo) => {
    if (valor <= 0 || isNaN(valor)) {
      return `El ${campo} debe ser un número mayor que 0.`;
    }
    return "";
  };

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMunicipio({ ...municipio, [name]: value });

    if (name === "nombre") setNombreError(validarNombre(value));
    if (name === "area") setAreaError(validarNumero(value, "área"));
    if (name === "presupuesto") setPresupuestoError(validarNumero(value, "presupuesto"));
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones finales
    const nombreErr = validarNombre(municipio.nombre);
    const areaErr = validarNumero(municipio.area, "área");
    const presupuestoErr = validarNumero(municipio.presupuesto, "presupuesto");

    if (nombreErr || areaErr || presupuestoErr) {
      setNombreError(nombreErr);
      setAreaError(areaErr);
      setPresupuestoError(presupuestoErr);
      return;
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
          {nombreError && <p className="error-message">{nombreError}</p>}
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
            name="departamentoid"
            value={municipio.departamentoid}
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
            name="alcaldeid"
            value={municipio.alcaldeid || ""}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Seleccionar Alcalde (opcional)</option>
            {alcaldes.map((alcalde) => (
              <option key={alcalde.id_persona} value={alcalde.id_persona}>
                {alcalde.nombre} (ID: {alcalde.id_persona})
              </option>
            ))}
          </select>

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
