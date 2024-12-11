import { supabase } from "../API/supabaseAPI";

export const readAllPersona = async () => {
    try {
        const { data, error } = await supabase.from("persona").select("*");
        if (error) {
            console.error("Error al obtener personas:", error);
            return { data: [], error };
        }
        return { data, error: null };
    } catch (err) {
        console.error("Error inesperado al obtener personas:", err);
        return { data: [], error: err };
    }
};

export const deletePersona = async (id) => {
    try {
        const { data, error } = await supabase.from("persona").delete().eq("id", id);
        if (error) {
            console.error(`Error al eliminar persona con ID ${id}:`, error);
            return { data: [], error };
        }
        return { data, error: null };
    } catch (err) {
        console.error(`Error inesperado al eliminar persona con ID ${id}:`, err);
        return { data: [], error: err };
    }
};
