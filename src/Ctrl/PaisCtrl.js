import { supabase } from "../API/supabaseAPI";

export const readAllPais = async () => {
  try {
    const { data, error } = await supabase.from("pais").select("*").order("id_pais");

    console.log(data);
    
    if (error) {
      console.error("Error al obtener países:", error);
      return { data: [], error };
    }
    return { data, error: null };
  } catch (err) {
    console.error("Error inesperado al obtener países:", err);
    return { data: [], error: err };
  }
};

export const readPais = async (id) => {
  try {
    const { data, error } = await supabase.from("pais").select("*").eq("id_pais", id);
    if (error) {
      console.error("Error al obtener el país:", error);
      return { data: [], error };
    }
    return { data, error: null };
  } catch (err) {
    console.error("Error inesperado al obtener el país:", err);
    return { data: [], error: err };
  }
};

export const deletePais = async (id) => {
  try {
    const { data, error } = await supabase.from("pais").delete().eq("id_pais", id);
    if (error) {
      console.error(`Error al eliminar el país con ID ${id}:`, error);
      return { data: [], error };
    }
    return { data, error: null };
  } catch (err) {
    console.error(`Error inesperado al eliminar el país con ID ${id}:`, err);
    return { data: [], error: err };
  }
};

export const createPais = async (pais) => {
  try {
    const { data, error } = await supabase.from("pais").insert(pais);

    if (error) {
        console.error("Error al crear pais:", error);
        return { data: null, error };
    }
    return { data, error: null };
} catch (err) {
    console.error("Error inesperado al crear pais:", err);
    return { data: null, error: err };
}
};

export const updatePais = async (id, updates) => {
  try {
    const { data, error } = await supabase.from("pais").update(updates).eq("id_pais", id);
    if (error) {
      console.error(`Error al modificar el país con ID ${id}:`, error);
      return { data: null, error };
    }
    return { data, error: null };
  } catch (err) {
    console.error(`Error inesperado al modificar el país con ID ${id}:`, err);
    return { data: null, error: err };
  }
};
