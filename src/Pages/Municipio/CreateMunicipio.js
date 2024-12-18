import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createMunicipio, readAllDepartamento } from "../../Ctrl/MunicipioCtrl";

const CrearMunicipio = () => {
  const [municipio, setMunicipio] = useState({
    nombre: "",
    area: "",
    presupuesto: "",
    departamentoID: "",
    alcaldeID: null,
  });
  const [departamentos, setDepartamentos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [areaError, setAreaError] = useState("");
  const [presupuestoError, setPresupuestoError] = useState("");
  const navegar = useNavigate();

  // Cargar los departamentos para el select
  useEffect(() => {
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
        console.error("Error inesperado al cargar departamentos:", err);
        alert("Hubo un error inesperado.");
      }
    };

    cargarDepartamentos();
  }, []);

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
          placeholder="Presupuesto (en millones)"
          value={municipio.presupuesto}
          onChange={handleChange}
          required
        />
        {presupuestoError && <p style={{ color: "red" }}>{presupuestoError}</p>}
        <select
          name="departamentoID"
          value={municipio.departamentoID}
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
        <input
          type="number"
          name="alcaldeID"
          placeholder="ID del Alcalde (opcional)"
          value={municipio.alcaldeID || ""}
          onChange={handleChange}
        />

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
