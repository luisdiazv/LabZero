import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createMunicipio } from "../../Ctrl/MunicipioCtrl";
import { readAllDepartamento } from "../../Ctrl/DepartamentoCtrl";
import { readAllPersona } from "../../Ctrl/PersonaCtrl"; // Importar la función para leer personas

const CrearMunicipio = () => {
  const [municipio, setMunicipio] = useState({
    nombre: "",
    area: "",
    presupuesto: "",
    departamentoid: "",
    alcaldeid: null,
  });
  const [departamentos, setDepartamentos] = useState([]);
  const [personas, setPersonas] = useState([]); // Lista de personas para el selector de alcalde
  const [cargando, setCargando] = useState(false);
  const [nombreError, setNombreError] = useState(""); // Validación para el nombre
  const [areaError, setAreaError] = useState("");
  const [presupuestoError, setPresupuestoError] = useState("");
  const navegar = useNavigate();

  // Cargar los departamentos y personas para los selects
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [deptResponse, personaResponse] = await Promise.all([
          readAllDepartamento(),
          readAllPersona(),
        ]);

        if (deptResponse.error) {
          console.error("Error al obtener departamentos:", deptResponse.error);
          alert("Hubo un problema al cargar los departamentos.");
        } else {
          setDepartamentos(deptResponse.data);
        }

        if (personaResponse.error) {
          console.error("Error al obtener personas:", personaResponse.error);
          alert("Hubo un problema al cargar las personas.");
        } else {
          setPersonas(personaResponse.data);
        }
      } catch (err) {
        console.error("Error inesperado al cargar datos:", err);
        alert("Hubo un error inesperado al cargar los datos.");
      }
    };

    cargarDatos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMunicipio({ ...municipio, [name]: value });

    // Validación de nombre (mínimo 3 caracteres)
    if (name === "nombre") {
      if (value.length < 3) {
        setNombreError("El nombre debe tener al menos 3 caracteres.");
      } else {
        setNombreError("");
      }
    }

    // Validación de área (mayor a 0)
    if (name === "area") {
      if (value <= 0 || isNaN(value)) {
        setAreaError("El área debe ser un número mayor que 0.");
      } else {
        setAreaError("");
      }
    }

    // Validación de presupuesto (mayor a 0)
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

    // Validaciones finales antes de enviar
    if (nombreError || municipio.nombre.length < 3) {
      setNombreError("El nombre debe tener al menos 3 caracteres.");
      return;
    }

    if (areaError || municipio.area <= 0 || municipio.area === "") {
      setAreaError("El área debe ser un número mayor que 0.");
      return;
    }

    if (presupuestoError || municipio.presupuesto <= 0 || municipio.presupuesto === "") {
      setPresupuestoError("El presupuesto debe ser un número mayor que 0.");
      return;
    }

    setCargando(true);
    try {
      const { error } = await createMunicipio(municipio);
      if (error) {
        console.error("Error al crear municipio:", error);
        alert("Hubo un error al crear el municipio.");
      } else {
        alert("Municipio creado exitosamente.");
        navegar("/municipios");
      }
    } catch (err) {
      console.error("Error inesperado al crear municipio:", err);
      alert("Hubo un error inesperado.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container">
      <h1>Crear Municipio</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={municipio.nombre}
          onChange={handleChange}
          required
        />
        {nombreError && <p style={{ color: "red" }}>{nombreError}</p>}
        <input
          type="number"
          name="area"
          placeholder="Área (en km²)"
          value={municipio.area}
          onChange={handleChange}
          required
        />
        {areaError && <p style={{ color: "red" }}>{areaError}</p>}
        <input
          type="number"
          name="presupuesto"
          placeholder="Presupuesto"
          value={municipio.presupuesto}
          onChange={handleChange}
          required
        />
        {presupuestoError && <p style={{ color: "red" }}>{presupuestoError}</p>}
        <select
          name="departamentoid"
          value={municipio.departamentoid}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione un Departamento</option>
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
        >
          <option value="">Seleccione un Alcalde (opcional)</option>
          {personas.map((persona) => (
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
            onClick={() => navegar("/municipios")}
            className="form-button cancel-button red-button"
          >
            Cancelar y volver
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearMunicipio;
