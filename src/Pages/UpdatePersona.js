import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { readPersona, updatePersona } from "../Ctrl/PersonaCtrl";

const ModificarPersona = () => {
    const { id } = useParams();
    const [persona, setPersona] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [actualizando, setActualizando] = useState(false);
    const navegar = useNavigate();

    useEffect(() => {
        const cargarPersona = async () => {
            try {
                const { data, error } = await readPersona(id);
                if (error) {
                    console.error("Error al cargar persona:", error);
                    alert("Hubo un problema al cargar los datos de la persona.");
                    navegar("/personas");
                } else {
                    setPersona(data[0]);
                }
            } catch (err) {
                console.error("Error inesperado:", err);
                alert("Hubo un error al cargar los datos de la persona.");
                navegar("/personas");
            } finally {
                setCargando(false);
            }
        };

        cargarPersona();
    }, [id, navegar]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPersona({ ...persona, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setActualizando(true);
        try {
            const { error } = await updatePersona(id, persona);
            if (error) {
                console.error("Error al modificar persona:", error);
                alert("Hubo un problema al modificar la persona.");
            } else {
                alert("Persona modificada exitosamente.");
                navegar("/personas");
            }
        } catch (err) {
            console.error("Error inesperado:", err);
            alert("Hubo un error inesperado al modificar la persona.");
        } finally {
            setActualizando(false);
        }
    };

    if (cargando) {
        return <p>Cargando datos...</p>;
    }

    return (
        <div className="container">
            <h1>Modificar Persona</h1>
            {persona && (
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
                    <button type="submit" disabled={actualizando}>
                        {actualizando ? "Actualizando..." : "Actualizar"}
                    </button>
                </form>
            )}
        </div>
    );
};

export default ModificarPersona;
