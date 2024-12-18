import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createVivienda } from "../../Ctrl/ViviendaCtrl";
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
