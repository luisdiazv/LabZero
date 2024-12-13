import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPersona, readAllPersona } from "../../Ctrl/PersonaCtrl";

const CrearPersona = () => {
    const [persona, setPersona] = useState({
        nombre: "",
        telefono: "",
        edad: "",
        sexo: "",
        cabezafamilia: null,
    });
    const [personasCabeza, setPersonasCabeza] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [edadError, setEdadError] = useState("");
    const [telefonoError, setTelefonoError] = useState("");
    const navegar = useNavigate();

    // Cargar las personas que son cabeza de familia
    useEffect(() => {
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

        setCargando(true);
        try {
            const { error } = await createPersona(persona);
            if (error) {
                console.error("Error al crear persona:", error);
                alert("Hubo un error al crear la persona.");
            } else {
                alert("Persona creada exitosamente.");
                navegar("/personas");
            }
        } catch (err) {
            console.error("Error inesperado:", err);
            alert("Hubo un error inesperado al crear la persona.");
        } finally {
            setCargando(false);
        }
    };

    // Función para manejar el cancel
    const handleCancel = () => {
        navegar("/personas");
    };

    return (
        <div className="container">
            <h1>Crear Persona</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={persona.nombre}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="telefono"
                    placeholder="Teléfono"
                    value={persona.telefono}
                    onChange={handleChange}
                    required
                />
                {telefonoError && <p style={{ color: "red" }}>{telefonoError}</p>}
                <input
                    type="number"
                    name="edad"
                    placeholder="Edad"
                    value={persona.edad}
                    onChange={handleChange}
                    required
                />
                {edadError && <p style={{ color: "red" }}>{edadError}</p>}
                <select name="sexo" value={persona.sexo} onChange={handleChange} required>
                    <option value="">Seleccione el Sexo</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                </select>
                <select
                    name="cabezafamilia"
                    value={persona.cabezafamilia}
                    onChange={handleChange}
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
                    <button type="submit" disabled={cargando} className="form-button form-button-small">
                        {cargando ? "Creando..." : "Crear"}
                    </button>
                    <button type="button" onClick={handleCancel} className="form-button form-button-small cancel-button red-button">
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CrearPersona;
