import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import { createPais } from "../../Ctrl/PaisCtrl";  
import { getPersona_IDNombre } from "../../Ctrl/PersonaCtrl";  

const CrearPais = () => {
  const [pais, setPais] = useState({
    nombre: "",         
    presidenteid: "",   
  });
  const [personas, setPersonas] = useState([]);  
  const [cargando, setCargando] = useState(false);  
  const navegar = useNavigate();  

  useEffect(() => {
    const cargarPersonas = async () => {
      try {
        const { data, error } = await getPersona_IDNombre();
        if (error) {
          console.error("Error al cargar las personas:", error);
          alert("Hubo un problema al cargar las personas.");
        } else {
          setPersonas(data);  
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
    setPais({
      ...pais,
      [name]: value,  
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();  

    setCargando(true);  

    try {
      const { error } = await createPais(pais);
      if (error) {
        alert("Error al crear el país.");
      } else {
        alert("País creado exitosamente.");
        navegar("/paises");  
      }
    } catch (err) {
      console.error("Error al crear el país:", err);
      alert("Hubo un error al crear el país.");
    } finally {
      setCargando(false);  
    }
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
          value={pais.presidenteid}
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
          <button 
            type="button" 
            onClick={() => navegar("/paises")} 
            className="form-button cancel-button red-button"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearPais;
