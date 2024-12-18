import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { readDepartamento, updateDepartamento } from "../../Ctrl/DepartamentoCtrl";
import { readAllPais } from "../../Ctrl/PaisCtrl";
import { readAllPersona } from "../../Ctrl/PersonaCtrl";
import "../Comun.css";

const ModificarDepartamento = () => {
  const { id } = useParams();
  const [departamento, setDepartamento] = useState({
    nombre: "",
    paisid: "",
    gobernadorid: "",
  });
  const [paises, setPaises] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [nombreError, setNombreError] = useState("");
  const [gobernadorError, setGobernadorError] = useState("");
  const navegar = useNavigate();

  useEffect(() => {
    const cargarDepartamento = async () => {
      try {
        const { data, error } = await readDepartamento(id);
        if (error || !data || data.length === 0) {
          console.error("Error al cargar departamento:", error);
          alert("Hubo un problema al cargar los datos del departamento.");
          navegar("/departamentos");
        } else {
          const dep = data[0];
          setDepartamento({
            nombre: dep.nombre || "",
            paisid: dep.paisid || "",
            gobernadorid: dep.gobernadorid || "",
          });
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

    const cargarPersonas = async () => {
      try {
        const { data, error } = await readAllPersona();
        if (error) {
          console.error("Error al obtener personas:", error);
          alert("Hubo un problema al cargar las personas.");
        } else {
          setPersonas(data);
        }
      } catch (err) {
        console.error("Error inesperado:", err);
        alert("Hubo un error al cargar las personas.");
      }
    };

    cargarDepartamento();
    cargarPaises();
    cargarPersonas();
  }, [id, navegar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartamento({ ...departamento, [name]: value });

    if (name === "nombre" && value.trim().length < 3) {
      setNombreError("El nombre del departamento debe tener al menos 3 caracteres.");
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

    if (nombreError || departamento.nombre.trim().length < 3) {
      setNombreError("El nombre del departamento debe tener al menos 3 caracteres.");
      return;
    }

    const gobernadorid = departamento.gobernadorid || "";
    if (typeof gobernadorid !== "string" || gobernadorid.trim() === "") {
      setGobernadorError("El gobernador del departamento es obligatorio.");
      return;
    }

    setActualizando(true);
    try {
      const { error } = await updateDepartamento(id, departamento);
      if (error) {
        console.error("Error al actualizar departamento:", error);
        alert("Hubo un problema al actualizar el departamento.");
      } else {
        alert("Departamento actualizado exitosamente.");
        navegar("/departamentos");
      }
    } catch (err) {
      console.error("Error inesperado al actualizar departamento:", err);
      alert("Hubo un error inesperado al actualizar el departamento.");
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
          {nombreError && <p style={{ color: "red" }}>{nombreError}</p>}

          <select
            name="paisid"
            value={departamento.paisid}
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
            {personas.map((persona) => (
              <option key={persona.id_persona} value={persona.id_persona}>
                {persona.nombre} (ID: {persona.id_persona})
              </option>
            ))}
          </select>
          {gobernadorError && <p className="error-message">{gobernadorError}</p>}

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
