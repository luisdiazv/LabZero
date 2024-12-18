import { restAPI } from "../API/postgRestAPI";

export const readAllVivienda = async () => {
    try {
        const { data, error } = await restAPI.from("vivienda").select("*").order("id_vivienda");

        if (error) {
            console.error("Error al obtener viviendas:", error);
            return { data: [], error };
        }
        return { data, error: null };
    } catch (err) {
        console.error("Error inesperado al obtener viviendas:", err);
        return { data: [], error: err };
    }
};


export const readVivienda = async (id) => {
    try {
        const { data, error } = await restAPI.from("vivienda").select("*").eq("id_vivienda", id);
        if (error) {
            console.error("Error al obtener viviendas:", error);
            return { data: [], error };
        }
        return { data, error: null };
    } catch (err) {
        console.error("Error inesperado al obtener viviendas:", err);
        return { data: [], error: err };
    }
};

export const deleteVivienda = async (id) => {
    try {
        const { error: errorRefsDef } = await restAPI.from("propiedad_vivienda").delete().eq("viviendaid", id);

        if (errorRefsDef) {
            console.error(`Error eliminando referencias definitivas en propiedad_vivienda:`, errorRefsDef);
            return { data: [], error: errorRefsDef };
        }
        const { data, error } = await restAPI.from("vivienda").delete().eq("id_vivienda", id);
        if (error) {
            console.error(`Error al eliminar vivienda con ID ${id}: `, error);
            return { data: [], error };
        }
        return { data, error: null };


    } catch (err) {
        console.error(`Error inesperado al eliminar vivienda con ID ${id}: `, err);
        return { data: [], error: err };
    }
};

export const createVivienda = async (vivienda) => {
    try {
        const { data, error } = await restAPI.from("vivienda").insert(vivienda);

        if (error) {
            console.error("Error al crear vivienda:", error);
            return { data: null, error };
        }

        return { data, error: null };
    } catch (err) {
        console.error("Error inesperado al crear departamento:", err);
        return { data: null, error: err };
    }
};

export const updateVivienda = async (id, updates) => {
    try {

        const { data, error } = await restAPI.from("vivienda").update(updates).eq("id_vivienda", id);

        if (error) {
            console.error(`Error al modificar vivienda con ID ${id}:`, error);
            return { data: null, error };
        }

        return { data, error: null };
    } catch (err) {
        console.error(`Error inesperado al modificar vivienda con ID ${id}:`, err);
        return { data: null, error: err };
    }
};

export const getVivienda_IDDireccion = async () => {
    try {
        const { data, error } = await restAPI.from("vivienda").select("id_vivienda, direccion").order("id_vivienda");

        if (error) {
            console.error("Error al obtener Viviendas:", error);
            return { data: [], error };
        }

        const viviendas = data.map(vivienda => ({
            id: vivienda.id_vivienda,
            nombre: vivienda.direccion
        }));

        return { data: viviendas, error: null };
    } catch (err) {
        console.error("Error inesperado al obtener viviendas:", err);
        return { data: [], error: err };
    }
};