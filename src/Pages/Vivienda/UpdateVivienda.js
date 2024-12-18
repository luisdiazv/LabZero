import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { readVivienda, updateVivienda, readAllVivienda } from "../../Ctrl/ViviendaCtrl";
import { readAllMunicipio } from "../../Ctrl/MunicipioCtrl";
import "../Comun.css";

const ModificarVivienda = () => {
    const { id } = useParams();
    const [vivienda, setVivienda] = useState(null);
    const [, setCiudades] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [actualizando, setActualizando] = useState(false);
    const [direccionError, setDireccionError] = useState("");
    const [capacidadError, setCapacidadError] = useState("");
    const [pisosError, setPisosError] = useState("");
    const [municipioidError, setMunicipioidError] = useState("");
    const [municipios, setMunicipios] = useState([]);
    const navegar = useNavigate();

    useEffect(() => {
        const cargarVivienda = async () => {
            try {
                const { data, error } = await readVivienda(id);
                if (error) {
                    console.error("Error al cargar vivienda:", error);
                    alert("Hubo un problema al cargar los datos de la vivienda.");
                    navegar("/viviendas");
                } else {
                    setVivienda(data[0]);
                }
            } catch (err) {
                console.error("Error inesperado:", err);
                alert("Hubo un error al cargar los datos de la vivienda.");
                navegar("/viviendas");
            } finally {
                setCargando(false);
            }
        };

        const cargarCiudades = async () => {
            try {
                const { data, error } = await readAllVivienda();
                if (error) {
                    console.error("Error al obtener viviendas:", error);
                    alert("Hubo un problema al cargar las viviendas.");
                } else {
                    setCiudades(data);
                }
            } catch (err) {
                console.error("Error inesperado:", err);
                alert("Hubo un error al cargar las viviendas.");
            }
        };
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
        cargarVivienda();
        cargarCiudades();
    }, [id, navegar]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVivienda({ ...vivienda, [name]: value });

        // Validaciones de los campos
        if (name === "direccion" && value.trim() === "") {
            setDireccionError("La dirección no puede estar vacía.");
        } else {
            setDireccionError("");
        }

        if (name === "capacidad" && (isNaN(value) || value <= 0)) {
            setCapacidadError("La capacidad debe ser un número mayor que 0.");
        } else {
            setCapacidadError("");
        }


        if (name === "pisos" && (isNaN(value) || value <= 0)) {
            setPisosError("El número de pisos debe ser mayor que 0.");
        } else {
            setPisosError("");
        }

        if (name === "municipioid" && !value) {
            setMunicipioidError("Debe seleccionar un municipio.");
        } else {
            setMunicipioidError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (direccionError || vivienda.direccion.trim() === "") {
            setDireccionError("La dirección no puede estar vacía.");
            return;
        }

        if (capacidadError || vivienda.capacidad <= 0) {
            setCapacidadError("La capacidad debe ser un número mayor que 0.");
            return;
        }


        if (pisosError || vivienda.pisos <= 0) {
            setPisosError("El número de pisos debe ser mayor que 0.");
            return;
        }

        if (municipioidError || !vivienda.municipioid) {
            setMunicipioidError("Debe seleccionar un municipio.");
            return;
        }

        setActualizando(true);
        try {
            const { error } = await updateVivienda(id, vivienda);
            if (error) {
                console.error("Error al modificar vivienda:", error);
                alert("Hubo un problema al modificar la vivienda.");
            } else {
                alert("Vivienda modificada exitosamente.");
                navegar("/viviendas");
            }
        } catch (err) {
            console.error("Error inesperado:", err);
            alert("Hubo un error inesperado al modificar la vivienda.");
        } finally {
            setActualizando(false);
        }
    };

    if (cargando) {
        return <p className="loading-text">Cargando datos...</p>;
    }

    return (
        <div className="container">
            <h1 className="form-title">Modificar Vivienda</h1>
            {vivienda && (
                <form className="crud-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="direccion"
                        placeholder="Dirección"
                        value={vivienda.direccion}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                    {direccionError && <p className="error-message">{direccionError}</p>}

                    <input
                        type="number"
                        name="capacidad"
                        placeholder="Capacidad"
                        value={vivienda.capacidad}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                    {capacidadError && <p className="error-message">{capacidadError}</p>}


                    <input
                        type="number"
                        name="pisos"
                        placeholder="Número de Pisos"
                        value={vivienda.pisos}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                    {pisosError && <p className="error-message">{pisosError}</p>}

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
                    {municipioidError && <p className="error-message">{municipioidError}</p>}

                    {/* Botones en la misma línea */}
                    <div className="form-buttons">
                        <button
                            type="submit"
                            disabled={actualizando}
                            className="form-button form-button-small"
                        >
                            {actualizando ? "Actualizando..." : "Actualizar"}
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
            )}
        </div>
    );
};

export default ModificarVivienda;
