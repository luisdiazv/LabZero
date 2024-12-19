import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPersona, readAllPersona } from "../../Ctrl/PersonaCtrl";
import "../Comun.css";

const CrearPersona = () => {
  const [persona, setPersona] = useState({
    nombre: "",
    telefono: "",
    edad: "",
    sexo: "Masculino",
    cabezafamilia: null
  });
  const [personasCabeza, setPersonasCabeza] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [edadError, setEdadError] = useState("");
  const [telefonoError, setTelefonoError] = useState("");
  const [creacionExitosa, setCreacionExitosa] = useState(false);
  const navegar = useNavigate();

  useEffect(() => {
    const cargarPersonasCabeza = async () => {
      try {
        setCargando(true);
        const { data, error } = await readAllPersona();
        if (error) {
          console.error("Error al obtener personas:", error);
          alert("Hubo un problema al cargar las personas.");
        } else {
          const cabezaPersonas = data.filter((persona) => persona.id_persona);
          setPersonasCabeza(cabezaPersonas);
        }
      } catch (err) {
        console.error("Error inesperado:", err);
        alert("Hubo un error al cargar las personas.");
      } finally {
        setCargando(false);
      }
    };

    cargarPersonasCabeza();
  }, []);

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
      return; 
    }

    if (telefonoError || persona.telefono.length < 7) {
      setTelefonoError("El teléfono debe tener al menos 7 dígitos.");
      return;
    }

    if (persona.cabezafamilia === "Seleccionar Cabeza de Familia (opcional)") {
      persona.cabezafamilia = null;
    }

    setCargando(true); // Empieza el proceso de creación
    setCreacionExitosa(false); // Asegura que se reinicie el estado de éxito

    try {
      const { error } = await createPersona(persona);
      if (error) {
        console.error("Error al crear persona:", error);
        alert("Hubo un problema al crear la persona.");
      } else {
        setCreacionExitosa(true); // Marcar como exitoso
        alert("Persona creada exitosamente.");
        navegar("/personas"); // Redirigir a la lista de personas después de la creación exitosa
      }
    } catch (err) {
      console.error("Error inesperado al crear la persona:", err);
      alert("Hubo un error inesperado al crear la persona.");
    } finally {
      setCargando(false); // Termina el proceso de creación, incluso si hay error
    }
  };

  return (
    <div className="container">
      <h1 className="form-title">Crear Persona</h1>
      {cargando ? (
        <p className="loading-text">Cargando...</p>
      ) : (
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
            {personasCabeza
              .filter((cabeza) => cabeza.id_persona !== persona.id_persona) // Excluir a sí mismo
              .map((cabeza) => (
                <option key={cabeza.id_persona} value={cabeza.id_persona}>
                  {cabeza.nombre} (ID: {cabeza.id_persona})
                </option>
              ))}
          </select>

          <div className="form-buttons">
            <button
              type="submit"
              disabled={cargando || creacionExitosa}
              className="form-button form-button-small"
            >
              {creacionExitosa ? "Creada" : (cargando ? "Creando..." : "Crear")}
            </button>
            <button
              type="button"
              onClick={() => navegar("/personas")}
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

export default CrearPersona;
