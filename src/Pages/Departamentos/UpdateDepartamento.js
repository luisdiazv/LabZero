import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { readDepartamento, updateDepartamento } from "../../Ctrl/DepartamentoCtrl";
import { readAllPais } from "../../Ctrl/PaisCtrl";
import "../Comun.css";

const ModificarDepartamento = () => {
  const { id } = useParams();
  const [departamento, setDepartamento] = useState(null);
  const [paises, setPaises] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [nombreError, setNombreError] = useState("");
  const [gobernadorError, setGobernadorError] = useState("");
  const navegar = useNavigate();

  useEffect(() => {
    const cargarDepartamento = async () => {
      try {
        const { data, error } = await readDepartamento(id);
        if (error) {
          console.error("Error al cargar departamento:", error);
          alert("Hubo un problema al cargar los datos del departamento.");
          navegar("/departamentos");
        } else {
          setDepartamento(data[0]);
        }
      } catch (err) {
        console.error("Error inesperado:", err);
        alert("Hubo un error al cargar los datos del departamento.");
        navegar("/departamentos");
      } finally {
        setCargando(false);
      }
    };

    const cargarPaises = async () => {
      try {
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
      }
    };

    cargarDepartamento();
    cargarPaises();
  }, [id, navegar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartamento({ ...departamento, [name]: value });

    if (name === "nombre" && value.trim() === "") {
      setNombreError("El nombre del departamento es obligatorio.");
    } else {
      setNombreError("");
    }

    if (name === "gobernadorid" && value.trim() === "") {
      setGobernadorError("El gobernador del departamento es obligatorio.");
    } else {
      setGobernadorError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (nombreError || departamento.nombre.trim() === "") {
      setNombreError("El nombre del departamento es obligatorio.");
      return; // No continuar si hay un error en el nombre
    }

    if (gobernadorError || departamento.gobernadoid.trim() === "") {
      setGobernadorError("El gobernador del departamento es obligatorio.");
      return; // No continuar si hay un error en el gobernador
    }

    setActualizando(true);
    try {
      const { error } = await updateDepartamento(id, departamento);
      if (error) {
        console.error("Error al modificar departamento:", error);
        alert("Hubo un problema al modificar el departamento.");
      } else {
        alert("Departamento modificado exitosamente.");
        navegar("/departamentos");
      }
    } catch (err) {
      console.error("Error inesperado:", err);
      alert("Hubo un error inesperado al modificar el departamento.");
    } finally {
      setActualizando(false);
    }
  };

  if (cargando) {
    return <p className="loading-text">Cargando datos...</p>;
  }

  return (
    <div className="container">
      <h1 className="form-title">Modificar Departamento</h1>
      {departamento && (
        <form className="crud-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del Departamento"
            value={departamento.nombre}
            onChange={handleChange}
            required
            className="form-input"
          />
          {nombreError && <p className="error-message">{nombreError}</p>}

          <select
            name="id_pais"
            value={departamento.id_pais}
            onChange={handleChange}
            required
            className="form-select"
          >
            <option value="">Seleccionar País</option>
            {paises.map((pais) => (
              <option key={pais.id_pais} value={pais.id_pais}>
                {pais.nombre} (ID: {pais.id_pais})
              </option>
            ))}
          </select>

          <select
            name="gobernadorid"
            value={departamento.gobernadorid}
            onChange={handleChange}
            required
            className="form-select"
          >
            <option value="">Seleccionar Gobernador</option>
            {/* Se puede llenar con datos de personas que son gobernadores */}
            {/* Para este ejemplo se deja un valor predeterminado de Gobernador ID */}
          </select>
          {gobernadorError && <p className="error-message">{gobernadorError}</p>}

          {/* Botones en la misma línea */}
          <div className="form-buttons">
            <button
              type="submit"
              disabled={actualizando}
              className="form-button form-button-small"
            >
              {actualizando ? "Actualizando..." : "Actualizar"}
            </button>
            <button
              type="button"
              onClick={() => navegar("/departamentos")}
              className="form-button cancel-button red-button"
            >
              Cancelar y volver
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ModificarDepartamento;
