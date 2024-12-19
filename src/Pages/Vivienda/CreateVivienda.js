import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createVivienda, readAllVivienda } from "../../Ctrl/ViviendaCtrl";  // Asegúrate de que readAllVivienda esté correctamente implementada
import { readAllMunicipio } from "../../Ctrl/MunicipioCtrl";

const CrearVivienda = () => {
    const [vivienda, setVivienda] = useState({
        direccion: "",
        capacidad: "",
        pisos: "",
        municipioid: "",
    });
    const [municipios, setMunicipios] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [capacidadError, setCapacidadError] = useState("");
    const [pisosError, setPisosError] = useState("");
    const [direccionExistenteError, setDireccionExistenteError] = useState(""); // Error de existencia
    const navegar = useNavigate();

    // Cargar los municipios disponibles
    useEffect(() => {
        const cargarMunicipios = async () => {
            try {
                const { data, error } = await readAllMunicipio();
                if (error) {
                    console.error("Error al obtener municipios:", error);
                    alert("Hubo un problema al cargar los municipios.");
                } else {
                    setMunicipios(data);
                }
            } catch (err) {
                console.error("Error inesperado:", err);
                alert("Hubo un error al cargar los municipios.");
            }
        };

        cargarMunicipios();
    }, []);

    // Verificar si ya existe una vivienda con la misma dirección en el mismo municipio
    const checkViviendaExistente = async () => {
        try {
            const { data, error } = await readAllVivienda(); // Obtener todas las viviendas
            if (error) {
                console.error("Error al obtener viviendas:", error);
                return false;
            }
    
            // Usar un ciclo for para verificar si ya existe una vivienda con la misma dirección en el mismo municipio
            for (let i = 0; i < data.length; i++) {
                const viviendaItem = data[i];
                console.log(viviendaItem)
                console.log(vivienda)
                if (viviendaItem.direccion+"" === vivienda.direccion+"" && viviendaItem.municipioid+"" === vivienda.municipioid+"") {
                    return true; // Si encuentra una vivienda existente, retorna true
                }
            }
    
            return false; // Si no encontró ninguna vivienda con la misma dirección y municipio, retorna false
        } catch (err) {
            console.error("Error inesperado:", err);
            return false;
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVivienda({ ...vivienda, [name]: value });

        if (name === "capacidad") {
            if (value <= 0 || isNaN(value)) {
                setCapacidadError("La capacidad debe ser un número mayor que 0.");
            } else {
                setCapacidadError("");
            }
        }

        if (name === "pisos") {
            if (value <= 0 || isNaN(value)) {
                setPisosError("El número de pisos debe ser un número mayor que 0.");
            } else {
                setPisosError("");
            }
        }

        if (name === "direccion") {
            setDireccionExistenteError(""); // Limpiar error cuando el usuario cambia la dirección
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (capacidadError || vivienda.capacidad <= 0 || vivienda.capacidad === "") {
            setCapacidadError("La capacidad debe ser un número mayor que 0.");
            return;
        }

        if (pisosError || vivienda.pisos <= 0 || vivienda.pisos === "") {
            setPisosError("El número de pisos debe ser un número mayor que 0.");
            return;
        }

        // Verificar si ya existe una vivienda con la misma dirección en el mismo municipio
        const viviendaExistente = await checkViviendaExistente();
        if (viviendaExistente) {
            setDireccionExistenteError("Ya existe una vivienda con esta dirección en el municipio seleccionado.");
            return;
        }

        setCargando(true);
        try {
            const { error } = await createVivienda(vivienda);
            if (error) {
                console.error("Error al crear vivienda:", error);
                alert("Hubo un error al crear la vivienda.");
            } else {
                alert("Vivienda creada exitosamente.");
                navegar("/viviendas");
            }
        } catch (err) {
            console.error("Error inesperado:", err);
            alert("Hubo un error inesperado al crear la vivienda.");
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="container">
            <h1>Crear Vivienda</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="direccion"
                    placeholder="Dirección"
                    value={vivienda.direccion}
                    onChange={handleChange}
                    required
                />
                {direccionExistenteError && <p style={{ color: "red" }}>{direccionExistenteError}</p>} {/* Mostrar error si existe */}
                <input
                    type="number"
                    name="capacidad"
                    placeholder="Capacidad"
                    value={vivienda.capacidad}
                    onChange={handleChange}
                    required
                />
                {capacidadError && <p style={{ color: "red" }}>{capacidadError}</p>}
                <input
                    type="number"
                    name="pisos"
                    placeholder="Pisos"
                    value={vivienda.pisos}
                    onChange={handleChange}
                    required
                />
                {pisosError && <p style={{ color: "red" }}>{pisosError}</p>}
                <select
                    name="municipioid"
                    value={vivienda.municipioid}
                    onChange={handleChange}
                    required
                >
                    <option value="">Seleccione un municipio</option>
                    {municipios.map((municipio) => (
                        <option key={municipio.id_municipio} value={municipio.id_municipio}>
                            {municipio.nombre}
                        </option>
                    ))}
                </select>

                {/* Botones en la misma línea */}
                <div className="form-buttons">
                    <button
                        type="submit"
                        disabled={cargando}
                        className="form-button form-button-small"
                    >
                        {cargando ? "Creando..." : "Crear"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navegar("/viviendas")}
                        className="form-button cancel-button red-button"
                    >
                        Cancelar y volver
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CrearVivienda;
