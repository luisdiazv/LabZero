import { restAPI } from "../API/postgRestAPI";

export const readAllDepartamento = async () => {
    try {
        const { data, error } = await restAPI.from("departamento").select("*").order("id_departamento");

        if (error) {
            console.error("Error al obtener departamentos:", error);
            return { data: [], error };
        }
        return { data, error: null };
    } catch (err) {
        console.error("Error inesperado al obtener departamentos:", err);
        return { data: [], error: err };
    }
};

export const readDepartamento = async (id) => {
    try {
        const { data, error } = await restAPI.from("departamento").select("*").eq("id_departamento", id);
        if (error) {
            console.error("Error al obtener departamentos:", error);
            return { data: [], error };
        }
        return { data, error: null };
    } catch (err) {
        console.error("Error inesperado al obtener departamento:", err);
        return { data: [], error: err };
    }
};

export const deleteDepartamento = async (id) => {
    try {
        const { error: errorRefsDef } = await restAPI.from("municipio").delete().eq("departamentoid", id);

        if (errorRefsDef) {
            console.error(`Error eliminando referencias definitivas en Municipio:`, errorRefsDef);
            return { data: [], error: errorRefsDef };
        }
        const { data, error } = await supabase.from("departamento").delete().eq("id_departamento", id);
        if (error) {
            console.error(`Error al eliminar departamento con ID ${id}: `, error);
            return { data: [], error };
        }
        return { data, error: null };


    } catch (err) {
        console.error(`Error inesperado al eliminar departamento con ID ${id}: `, err);
        return { data: [], error: err };
    }
};


export const createDepartamento = async (departamento) => {
    try {
        const { data, error } = await restAPI.from("departamento").insert(departamento);

        if (error) {
            console.error("Error al crear departamento:", error);
            return { data: null, error };
        }

        return { data, error: null };
    } catch (err) {
        console.error("Error inesperado al crear departamento:", err);
        return { data: null, error: err };
    }
};

export const updateDepartamento = async (id, updates) => {
    try {

        const { data, error } = await restAPI.from("departamento").update(updates).eq("id_departamento", id);

        if (error) {
            console.error(`Error al modificar departamento con ID ${id}:`, error);
            return { data: null, error };
        }

        return { data, error: null };
    } catch (err) {
        console.error(`Error inesperado al modificar departamento con ID ${id}:`, err);
        return { data: null, error: err };
    }
};