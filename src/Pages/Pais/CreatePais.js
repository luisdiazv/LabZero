import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import { createPais } from "../../Ctrl/PaisCtrl";
import { obtenerPersonasIDNombre } from "../../Ctrl/PersonaCtrl";

const CrearPais = () => {
  const [pais, setPais] = useState({
    nombre: "",
    presidenteid: null,
  });
  const [personas, setPersonas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const navegar = useNavigate();

  // Cargar las personas disponibles para ser presidente
  useEffect(() => {
    const cargarPersonas = async () => {
      try {
        const { data: personasData, error: personasError } = await obtenerPersonasIDNombre();
        if (personasError) {
          console.error("Error al cargar las personas:", personasError);
          alert("Hubo un problema al cargar las personas.");
        } else {
          setPersonas(personasData); // Guardamos las personas
        }
      } catch (err) {
        console.error("Error inesperado:", err);
        alert("Hubo un error inesperado.");
      }
    };

    cargarPersonas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPais({ ...pais, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    const { data, error } = await createPais(pais);
    if (error) {
      alert("Error al crear el país");
    } else {
      alert(`País creado exitosamente: ${data.nombre}`);
      navegar("/paises");
    }
    setCargando(false);
  };

  return (
    <div className="container">
      <h1>Crear País</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del País"
          value={pais.nombre}
          onChange={handleChange}
          required
        />
        
        <select
          name="presidenteid"
          value={pais.presidenteid || ""}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Selecciona un presidente</option>
          {personas.map((persona) => (
            <option key={persona.id} value={persona.id}>
              {persona.nombre} (ID: {persona.id})
            </option>
          ))}
        </select>

        <div className="form-buttons-container">
          <button type="submit" disabled={cargando} className="form-button create-button">
            {cargando ? "Creando..." : "Crear País"}
          </button>
          <button type="button" onClick={() => navegar("/paises")} className="form-button cancel-button red-button">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearPais;
