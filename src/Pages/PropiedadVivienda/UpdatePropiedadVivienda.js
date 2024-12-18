import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updatePropiedadVivienda, tienePropietaria } from "../../Ctrl/PropiedadViviendaCtrl";
import { readAllPersona } from "../../Ctrl/PersonaCtrl";
import { readAllVivienda } from "../../Ctrl/ViviendaCtrl";

const ModificarPropiedadVivienda = () => {
  const { id } = useParams(); // ID de la propiedad desde la URL
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
        // Cargar las personas
        const { data: personasData, error: personasError } = await readAllPersona();
        if (personasError) {
          console.error("Error al cargar las personas:", personasError);
          alert("Hubo un problema al cargar las personas.");
        } else {
          setPersonas(personasData);
        }

        // Cargar las viviendas
        const { data: viviendasData, error: viviendasError } = await readAllVivienda();
        if (viviendasError) {
          console.error("Error al cargar las viviendas:", viviendasError);
          alert("Hubo un problema al cargar las viviendas.");
        } else {
          setViviendas(viviendasData);
        }

        // Configurar valores iniciales con datos precargados (puedes ajustar según tu lógica)
        setPropiedadVivienda({
          propietariaid: personasData?.[0]?.id_persona || "", // Default al primer ID disponible
          viviendaid: viviendasData?.[0]?.id_vivienda || "",
        });
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

    const { data: tieneDueno, error } = await tienePropietaria(propiedadVivienda.viviendaid);

    if (error) {
      console.error("Error al verificar si la vivienda tiene dueño:", error);
      alert("Hubo un error al verificar la propiedad.");
      setCargando(false);
      return;
    }

    if (tieneDueno && propiedadVivienda.viviendaid !== id) {
      alert("Esta vivienda ya tiene dueño");
      setCargando(false);
      return;
    }

    try {
      const { error } = await updatePropiedadVivienda(id, propiedadVivienda);
      if (error) {
        alert("Error al actualizar la propiedad de vivienda.");
      } else {
        alert("Propiedad de vivienda actualizada exitosamente.");
        navegar("/propiedad-vivienda");
      }
    } catch (err) {
      console.error("Error al actualizar la propiedad de vivienda:", err);
      alert("Hubo un error al actualizar la propiedad de vivienda.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container">
      <h1>Modificar Propiedad de Vivienda</h1>
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
            {cargando ? "Actualizando..." : "Actualizar Propiedad"}
          </button>
          <button
            type="button"
            onClick={() => navegar("/propiedad-vivienda")}
            className="form-button cancel-button red-button"
          >
            Cancelar y volver
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModificarPropiedadVivienda;
