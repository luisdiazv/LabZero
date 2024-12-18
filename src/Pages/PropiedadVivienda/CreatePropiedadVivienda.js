import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPropiedadVivienda } from "../../Ctrl/PropiedadViviendaCtrl";
import { readAllPersona } from "../../Ctrl/PersonaCtrl";
import { readAllVivienda } from "../../Ctrl/ViviendaCtrl";
import { tienePropietaria } from "../../Ctrl/PropiedadViviendaCtrl";  // Importamos el método

const CrearPropiedadVivienda = () => {
  const [propiedadVivienda, setPropiedadVivienda] = useState({
    propietariaid: "",
    viviendaid: "",
  });
  const [personas, setPersonas] = useState([]);
  const [viviendas, setViviendas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const navegar = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const { data: personasData, error: personasError } = await readAllPersona();
        if (personasError) {
          console.error("Error al cargar las personas:", personasError);
          alert("Hubo un problema al cargar las personas.");
        } else {
          setPersonas(personasData);
        }

        const { data: viviendasData, error: viviendasError } = await readAllVivienda();
        if (viviendasError) {
          console.error("Error al cargar las viviendas:", viviendasError);
          alert("Hubo un problema al cargar las viviendas.");
        } else {
          setViviendas(viviendasData);
        }
      } catch (err) {
        console.error("Error inesperado:", err);
        alert("Hubo un error inesperado.");
      }
    };
    cargarDatos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPropiedadVivienda({
      ...propiedadVivienda,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setCargando(true);

    // Verificar si la vivienda ya tiene dueño usando el método 'tienePropietaria'
    const { data: tieneDueno, error } = await tienePropietaria(propiedadVivienda.viviendaid);

    if (error) {
      console.error("Error al verificar si la vivienda tiene dueño:", error);
      alert("Hubo un error al verificar la propiedad.");
      setCargando(false);
      return;
    }

    if (tieneDueno) {
      alert("Esta vivienda ya tiene dueño");
      setCargando(false);
      return; // Salir del proceso de creación si ya tiene dueño
    }

    try {
      const { error } = await createPropiedadVivienda(propiedadVivienda);
      if (error) {
        alert("Error al crear la propiedad de vivienda.");
      } else {
        alert("Propiedad de vivienda creada exitosamente.");
        navegar("/propiedad-vivienda");
      }
    } catch (err) {
      console.error("Error al crear propiedad de vivienda:", err);
      alert("Hubo un error al crear la propiedad de vivienda.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container">
      <h1>Crear Propiedad de Vivienda</h1>
      <form onSubmit={handleSubmit}>
        <select
          name="propietariaid"
          value={propiedadVivienda.propietariaid}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Selecciona una propietaria</option>
          {personas.map((persona) => (
            <option key={persona.id_persona} value={persona.id_persona}>
              {persona.nombre} (ID: {persona.id_persona})
            </option>
          ))}
        </select>

        <select
          name="viviendaid"
          value={propiedadVivienda.viviendaid}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Selecciona una vivienda</option>
          {viviendas.map((vivienda) => (
            <option key={vivienda.id_vivienda} value={vivienda.id_vivienda}>
              {vivienda.direccion} (ID: {vivienda.id_vivienda})
            </option>
          ))}
        </select>

        <div className="form-buttons-container">
          <button type="submit" disabled={cargando} className="form-button create-button">
            {cargando ? "Creando..." : "Crear Propiedad"}
          </button>
          <button
            type="button"
            onClick={() => navegar("/propiedad-vivienda/")}
            className="form-button cancel-button red-button"
          >
            Cancelar y volver
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearPropiedadVivienda;
