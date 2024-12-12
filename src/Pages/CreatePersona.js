import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPersona } from "../Ctrl/PersonaCtrl";

const CrearPersona = () => {
    const [persona, setPersona] = useState({
        nombre: "",
        documentoidentidad: "",
        telefono: "",
        edad: "",
        sexo: "",
        viviendaid: "",
        cabezafamilia: null,
    });
    const [cargando, setCargando] = useState(false);
    const navegar = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPersona({ ...persona, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                <input
                    type="text"
                    name="documentoidentidad"
                    placeholder="Documento de Identidad"
                    value={persona.documentoidentidad}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="telefono"
                    placeholder="Teléfono"
                    value={persona.telefono}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="edad"
                    placeholder="Edad"
                    value={persona.edad}
                    onChange={handleChange}
                    required
                />
                <select name="sexo" value={persona.sexo} onChange={handleChange} required>
                    <option value="">Seleccione el Sexo</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                </select>
                <input
                    type="number"
                    name="viviendaid"
                    placeholder="Vivienda ID"
                    value={persona.viviendaid}
                    onChange={handleChange}
                />
                <button type="submit" disabled={cargando}>
                    {cargando ? "Creando..." : "Crear"}
                </button>
            </form>
        </div>
    );
};

export default CrearPersona;
