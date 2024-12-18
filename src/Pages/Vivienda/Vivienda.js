import "../Comun.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { readAllVivienda, deleteVivienda, readVivienda } from "../../Ctrl/ViviendaCtrl";

const Viviendas = () => {
    const [viviendas, setViviendas] = useState([]);
    const [direcciones, setDirecciones] = useState({});
    const [cargando, setCargando] = useState(true);
    const [eliminando, setEliminando] = useState({});
    const navegar = useNavigate();

    useEffect(() => {
        const cargarViviendas = async () => {
            try {
                setCargando(true);
                const { data, error } = await readAllVivienda();
                if (error) {
                    console.error("Error al obtener viviendas:", error);
                    alert("Hubo un problema al cargar las viviendas.");
                } else {
                    setViviendas(data);

                    const idsDirecciones = data.map((vivienda) => vivienda.id_vivienda);

                    const direccionesData = {};
                    await Promise.all(
                        idsDirecciones.map(async (id) => {
                            const { data: viviendaData, error: errorVivienda } = await readVivienda(id);
                            if (errorVivienda) {
                                console.error(`Error al obtener vivienda con ID ${id}:`, errorVivienda);
                            } else if (viviendaData && viviendaData.length > 0) {
                                direccionesData[id] = viviendaData[0].direccion;
                            }
                        })
                    );
                    setDirecciones(direccionesData);
                }
            } catch (err) {
                console.error("Error inesperado:", err);
                alert("Hubo un error al cargar las viviendas.");
            } finally {
                setCargando(false);
            }
        };

        cargarViviendas();
    }, []);

    const eliminarVivienda = async (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar esta vivienda?")) {
            try {
                setEliminando((prev) => ({ ...prev, [id]: true }));
                const { error } = await deleteVivienda(id);
                if (error) {
                    console.error("Error al eliminar vivienda:", error);
                    alert("Hubo un problema al eliminar la vivienda.");
                } else {
                    setViviendas(viviendas.filter((vivienda) => vivienda.id_vivienda !== id));
                    alert("Vivienda eliminada exitosamente.");
                }
            } catch (err) {
                console.error("Error inesperado:", err);
                alert("Hubo un error inesperado al eliminar la vivienda.");
            } finally {
                setEliminando((prev) => ({ ...prev, [id]: false }));
            }
        }
    };

    return (
        <div className="container">
            <div className="header text-center">
                <h1>CRUD</h1>
                <h1>Viviendas</h1>
            </div>

            <div className="button-container text-center">
                <button className="inicio-btn" onClick={() => navegar("/")}>Inicio</button>
                <button id="Personas" onClick={() => navegar("/personas")}>Personas</button>
                <button id="Vivienda" onClick={() => navegar("/viviendas")}>Viviendas</button>
                <button id="Propiedad de Vivienda" onClick={() => navegar("/propiedad-vivienda")}>Propiedad de Vivienda</button>
                <button id="Residencia" onClick={() => navegar("/residencias")}>Residencias</button>
                <button id="Municipios" onClick={() => navegar("/municipios")}>Municipios</button>
                <button id="Departamentos" onClick={() => navegar("/departamentos")}>Departamentos</button>
                <button id="Paises" onClick={() => navegar("/paises")}>Paises</button>
            </div>

            {!cargando && (
                <div className="text-center">
                    <button className="crear-btn" onClick={() => navegar("/viviendas/crear-vivienda")}>
                        Crear Vivienda
                    </button>
                </div>
            )}

            <div className="viviendas-list">
                {cargando ? (
                    <p>Cargando viviendas...</p>
                ) : viviendas.length > 0 ? (
                    viviendas.map((vivienda) => (
                        <div className="info-card" key={vivienda.id_vivienda}>
                            <h2>{vivienda.direccion}</h2>
                            <p><strong>Vivienda ID: </strong> {vivienda.id_vivienda}</p>
                            <p><strong>Teléfono:</strong> {vivienda.telefono}</p>
                            <p><strong>Precio:</strong> {vivienda.precio}</p>
                            <p><strong>Propietario:</strong> {vivienda.propietario}</p>
                            <p>
                                <strong>Dirección:</strong>{" "}
                                {direcciones[vivienda.id_vivienda] || "No disponible"}
                            </p>

                            <div className="info-buttons">
                                <button className="modificar-btn" onClick={() => navegar(`/viviendas/modificar-vivienda/${vivienda.id_vivienda}`)}>
                                    Modificar
                                </button>
                                <button
                                    className="eliminar-btn"
                                    onClick={() => eliminarVivienda(vivienda.id_vivienda)}
                                    disabled={eliminando[vivienda.id_vivienda] || false}
                                >
                                    {eliminando[vivienda.id_vivienda] ? "Eliminando..." : "Eliminar"}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No hay viviendas disponibles.</p>
                )}
            </div>
        </div>
    );
};

export default Viviendas;
