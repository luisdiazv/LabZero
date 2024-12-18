import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createDepartamento } from "../../Ctrl/DepartamentoCtrl";
import { readAllPais } from "../../Ctrl/PaisCtrl";
import { readAllPersona } from "../../Ctrl/PersonaCtrl";

const CrearDepartamento = () => {
  const [departamento, setDepartamento] = useState({
    nombre: "",
    paisid: "",
    gobernadorid: "",
  });
  const [paises, setPaises] = useState([]);
  const [gobernadores, setGobernadores] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [nombreError, setNombreError] = useState("");
  const navegar = useNavigate();

  // Cargar los países y los posibles gobernadores
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Cargar los países
        const { data: paisesData, error: paisesError } = await readAllPais();
        if (paisesError) {
          console.error("Error al obtener países:", paisesError);
          alert("Hubo un problema al cargar los países.");
        } else {
          setPaises(paisesData);
        }

        // Cargar las personas que pueden ser gobernadores
        const { data: personasData, error: personasError } = await readAllPersona();
        if (personasError) {
          console.error("Error al obtener personas:", personasError);
          alert("Hubo un problema al cargar los gobernadores.");
        } else {
          setGobernadores(personasData);
        }
      } catch (err) {
        console.error("Error inesperado al cargar los datos:", err);
        alert("Hubo un error inesperado al cargar los datos.");
      }
    };

    cargarDatos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartamento({ ...departamento, [name]: value });

    // Validación de nombre de departamento
    if (name === "nombre" && value.trim().length < 3) {
      setNombreError("El nombre del departamento debe tener al menos 3 caracteres.");
    } else {
      setNombreError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de nombre del departamento
    if (nombreError || departamento.nombre.trim().length < 3) {
      setNombreError("El nombre del departamento debe tener al menos 3 caracteres.");
      return;
    }

    setCargando(true);
    try {
      const { error } = await createDepartamento(departamento);
      if (error) {
        console.error("Error al crear departamento:", error);
        alert("Hubo un error al crear el departamento.");
      } else {
        alert("Departamento creado exitosamente.");
        navegar("/departamentos");
      }
    } catch (err) {
      console.error("Error inesperado al crear el departamento:", err);
      alert("Hubo un error inesperado al crear el departamento.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container">
      <h1>Crear Departamento</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del Departamento"
          value={departamento.nombre}
          onChange={handleChange}
          required
        />
        {nombreError && <p style={{ color: "red" }}>{nombreError}</p>}

        <select name="paisid" value={departamento.paisid} onChange={handleChange} required>
          <option value="">Seleccione el País</option>
          {paises.map((pais) => (
            <option key={pais.paisid} value={pais.paisid}>
              {pais.nombre} (ID: {pais.paisid})
            </option>
          ))}
        </select>

        <select
          name="gobernadorid"
          value={departamento.gobernadorid}
          onChange={handleChange}
        >
          <option value="">Seleccionar Gobernador (opcional)</option>
          {gobernadores.map((persona) => (
            <option key={persona.id_persona} value={persona.id_persona}>
              {persona.nombre} (ID: {persona.id_persona})
            </option>
          ))}
        </select>

        {/* Botones en la misma línea */}
        <div className="form-buttons">
          <button type="submit" disabled={cargando} className="form-button form-button-small">
            {cargando ? "Creando..." : "Crear"}
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
    </div>
  );
};

export default CrearDepartamento;
