import { restAPI } from "../API/postgRestAPI";
import { deleteVivienda } from "./ViviendaCtrl";

export const readAllMunicipio = async () => {
    try {
        const { data, error } = await restAPI.from("municipio").select("*").order("id_municipio");

        if (error) {
            console.error("Error al obtener municipios:", error);
            return { data: [], error };
        }
        return { data, error: null };
    } catch (err) {
        console.error("Error inesperado al obtener municipios:", err);
        return { data: [], error: err };
    }
};

export const readMunicipio = async (id) => {
    try {
        const { data, error } = await restAPI.from("municipio").select("*").eq("id_municipio", id);
        if (error) {
            console.error("Error al obtener municipios:", error);
            return { data: [], error };
        }
        return { data, error: null };
    } catch (err) {
        console.error("Error inesperado al obtener municipio:", err);
        return { data: [], error: err };
    }
};

export const deleteMunicipio = async (id) => {
    try {
        
        const { error: errorRefsDef } = await deleteVivienda(id);
        if (errorRefsDef) {
            console.error(`Error eliminando referencias definitivas en Vivienda:`, errorRefsDef);
            return { data: [], error: errorRefsDef };
        }

        const { data, error } = await restAPI.from("municipio").delete().eq("id_municipio", id);
        if (error) {
            console.error(`Error al eliminar municipio con ID ${id}: `, error);
            return { data: [], error };
        }
        return { data, error: null };


    } catch (err) {
        console.error(`Error inesperado al eliminar municipio con ID ${id}: `, err);
        return { data: [], error: err };
    }
};


export const createMunicipio = async (municipio) => {
    try {
        const { data, error } = await restAPI.from("municipio").insert(municipio);

        if (error) {
            console.error("Error al crear municipio:", error);
            return { data: null, error };
        }

        return { data, error: null };
    } catch (err) {
        console.error("Error inesperado al crear municipio:", err);
        return { data: null, error: err };
    }
};

export const updateMunicipio = async (id, updates) => {
    try {

        const { data, error } = await restAPI.from("municipio").update(updates).eq("id_municipio", id);

        if (error) {
            console.error(`Error al modificar municipio con ID ${id}:`, error);
            return { data: null, error };
        }

        return { data, error: null };
    } catch (err) {
        console.error(`Error inesperado al modificar municipio con ID ${id}:`, err);
        return { data: null, error: err };
    }
};