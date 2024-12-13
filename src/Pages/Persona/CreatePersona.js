import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPersona, readAllPersona } from "../../Ctrl/PersonaCtrl";

const CrearPersona = () => {
    const [persona, setPersona] = useState({
        nombre: "",
        // documentoidentidad: "",  // Documento de Identidad (dejar comentado)
        telefono: "",
        edad: "",
        sexo: "",
        cabezafamilia: null,
    });
    const [personasCabeza, setPersonasCabeza] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [edadError, setEdadError] = useState(""); // Estado para el error de edad
    const [telefonoError, setTelefonoError] = useState(""); // Estado para el error de teléfono
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

        // Verificación de la edad
        if (name === "edad") {
            if (value <= 0 || isNaN(value)) {
                setEdadError("La edad debe ser un número mayor que 0.");
            } else {
                setEdadError(""); // Limpiar error si la edad es válida
            }
        }

        // Verificación de teléfono
        if (name === "telefono") {
            if (value.length < 7 || isNaN(value)) {
                setTelefonoError("El teléfono debe tener al menos 7 dígitos.");
            } else {
                setTelefonoError(""); // Limpiar error si el teléfono es válido
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verificación de la edad antes de enviar el formulario
        if (edadError || persona.edad <= 0 || persona.edad === "") {
            setEdadError("La edad debe ser un número mayor que 0.");
            return; // No continuar si hay un error en la edad
        }

        // Verificación de teléfono antes de enviar el formulario
        if (telefonoError || persona.telefono.length < 7) {
            setTelefonoError("El teléfono debe tener al menos 7 dígitos.");
            return; // No continuar si hay un error en el teléfono
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
                {/* <input
                    type="text"
                    name="documentoidentidad"
                    placeholder="Documento de Identidad"
                    value={persona.documentoidentidad}
                    onChange={handleChange}
                    required
                /> */}
                <input
                    type="text"
                    name="telefono"
                    placeholder="Teléfono"
                    value={persona.telefono}
                    onChange={handleChange}
                    required
                />
                {telefonoError && <p style={{ color: "red" }}>{telefonoError}</p>} {/* Mostrar mensaje de error */}
                <input
                    type="number"
                    name="edad"
                    placeholder="Edad"
                    value={persona.edad}
                    onChange={handleChange}
                    required
                />
                {edadError && <p style={{ color: "red" }}>{edadError}</p>} {/* Mostrar mensaje de error */}
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
                <button type="submit" disabled={cargando}>
                    {cargando ? "Creando..." : "Crear"}
                </button>
            </form>
        </div>
    );
};

export default CrearPersona;