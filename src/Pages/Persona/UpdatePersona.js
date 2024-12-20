import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { readAllPersona, readPersona, updatePersona } from "../../Ctrl/PersonaCtrl";
import "../Comun.css";

const ModificarPersona = () => {
  const { id } = useParams();
  const [persona, setPersona] = useState(null);
  const [personasCabeza, setPersonasCabeza] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [edadError, setEdadError] = useState("");
  const [telefonoError, setTelefonoError] = useState("");
  const navegar = useNavigate();

  useEffect(() => {
    const cargarPersona = async () => {
      try {
        const { data, error } = await readPersona(id);
        if (error) {
          console.error("Error al cargar persona:", error);
          alert("Hubo un problema al cargar los datos de la persona.");
          navegar("/personas");
        } else {
          setPersona(data[0]);
        }
      } catch (err) {
        console.error("Error inesperado:", err);
        alert("Hubo un error al cargar los datos de la persona.");
        navegar("/personas");
      } finally {
        setCargando(false);
      }
    };

    const cargarPersonasCabeza = async () => {
      try {
        const { data, error } = await readAllPersona();
        if (error) {
          console.error("Error al obtener personas:", error);
          alert("Hubo un problema al cargar las personas.");
        } else {
          const cabezaPersonas = data.filter((persona) => persona.cabezafamilia);
          setPersonasCabeza(cabezaPersonas);
        }
      } catch (err) {
        console.error("Error inesperado:", err);
        alert("Hubo un error al cargar las personas.");
      }
    };

    cargarPersona();
    cargarPersonasCabeza();
  }, [id, navegar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPersona({ ...persona, [name]: value });

    if (name === "edad") {
      if (value <= 0 || isNaN(value)) {
        setEdadError("La edad debe ser un número mayor que 0.");
      } else {
        setEdadError("");
      }
    }

    if (name === "telefono") {
      if (value.length < 7 || isNaN(value)) {
        setTelefonoError("El teléfono debe tener al menos 7 dígitos.");
      } else {
        setTelefonoError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (edadError || persona.edad <= 0 || persona.edad === "") {
      setEdadError("La edad debe ser un número mayor que 0.");
      return; // No continuar si hay un error en la edad
    }

    if (telefonoError || persona.telefono.length < 7) {
      setTelefonoError("El teléfono debe tener al menos 7 dígitos.");
      return; // No continuar si hay un error en el teléfono
    }

    setActualizando(true);
    try {
      const { error } = await updatePersona(id, persona);
      if (error) {
        console.error("Error al modificar persona:", error);
        alert("Hubo un problema al modificar la persona.");
      } else {
        alert("Persona modificada exitosamente.");
        navegar("/personas");
      }
    } catch (err) {
      console.error("Error inesperado:", err);
      alert("Hubo un error inesperado al modificar la persona.");
    } finally {
      setActualizando(false);
    }
  };

  if (cargando) {
    return <p className="loading-text">Cargando datos...</p>;
  }

  return (
    <div className="container">
      <h1 className="form-title">Modificar Persona</h1>
      {persona && (
        <form className="crud-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={persona.nombre}
            onChange={handleChange}
            required
            className="form-input"
          />
          <input
            type="text"
            name="telefono"
            placeholder="Teléfono"
            value={persona.telefono}
            onChange={handleChange}
            required
            className="form-input"
          />
          {telefonoError && <p className="error-message">{telefonoError}</p>}
          <input
            type="number"
            name="edad"
            placeholder="Edad"
            value={persona.edad}
            onChange={handleChange}
            required
            className="form-input"
          />
          {edadError && <p className="error-message">{edadError}</p>}
          <select
            name="sexo"
            value={persona.sexo}
            onChange={handleChange}
            required
            className="form-select"
          >
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>

          <select
            name="cabezafamilia"
            value={persona.cabezafamilia}
            onChange={handleChange}
            className="form-select"
          >
            <option value={null}>Seleccionar Cabeza de Familia (opcional)</option>
            {personasCabeza.map((cabeza) => (
              <option key={cabeza.id_persona} value={cabeza.id_persona}>
                {cabeza.nombre} (ID: {cabeza.id_persona})
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
            <button type="button" onClick={() => navegar("/paises")} className="form-button cancel-button red-button">
              Cancelar y volver
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ModificarPersona;
