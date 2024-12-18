import { restAPI } from "../API/postgRestAPI";

export const readAllPropiedadVivienda = async () => {
  try {
    const { data, error } = await restAPI.from("propiedad_vivienda").select("*").order("propietariaid");

    if (error) {
      console.error("Error al obtener propiedad_vivienda:", error);
      return { data: [], error };
    }
    return { data, error: null };
  } catch (err) {
    console.error("Error inesperado al obtener propiedad_vivienda:", err);
    return { data: [], error: err };
  }
};

export const readPropiedadVivienda = async (id) => {
  try {
    const { data, error } = await restAPI.from("propiedad_vivienda").select("*").eq("id_propiedad_vivienda", id);
    if (error) {
      console.error("Error al obtener propiedad_vivienda:", error);
      return { data: [], error };
    }
    return { data, error: null };
  } catch (err) {
    console.error("Error inesperado al obtener propiedad_vivienda:", err);
    return { data: [], error: err };
  }
};

export const deletePropiedadVivienda = async (id) => {
  try {
    const { data, error } = await restAPI.from("propiedad_vivienda").delete().eq("id_propiedad_vivienda", id);
    if (error) {
      console.error(`Error al eliminar proviedad_vivienda con PropiedadVivienda ID ${id}:`, error);
      return { data: [], error };
    }
    return { data, error: null };
  } catch (err) {
    console.error(`Error inesperado al eliminar proviedad_vivienda con PropiedadVivienda ID ${id}:`, err);
    return { data: [], error: err };
  }
};

export const createPropiedadVivienda = async (propiedad_vivienda) => {
  try {
    const { data, error } = await restAPI.from("propiedad_vivienda").insert(propiedad_vivienda);

    if (error) {
        console.error("Error al crear propiedad_vivienda:", error);
        return { data: null, error };
    }

    return { data, error: null };
} catch (err) {
    console.error("Error inesperado al crear propiedad_vivienda:", err);
    return { data: null, error: err };
}
};

export const updatePropiedadVivienda = async (id, updates) => {
  try {

      const { data, error } = await restAPI.from("propiedad_vivienda").update(updates).eq("id_propiedad_vivienda", id);

      if (error) {
          console.error(`Error al modificar proviedad_vivienda con PropiedadVivienda ID ${id}:`, error);
          return { data: null, error };
      }

      return { data, error: null };
  } catch (err) {
      console.error(`Error inesperado al modificar proviedad_vivienda con PropiedadVivienda ID ${id}:`, err);
      return { data: null, error: err };
  }
};

export const tienePropietaria = async (id_vivienda) => {
  try {
    const { data, error } = await restAPI.from("propiedad_vivienda").select("*").eq("viviendaid", id_vivienda);
    
    if (error) {
      console.error("Error al obtener propiedad_vivienda:", error);
      return { data: false, error };  // Cambié aquí para devolver 'false' en caso de error.
    }

    // Retorna 'true' si hay datos, o 'false' si no hay.
    return { data: data.length > 0, error: null };
    
  } catch (err) {
    console.error("Error inesperado al obtener propiedad_vivienda:", err);
    return { data: false, error: err };  // Retorna 'false' en caso de error inesperado.
  }
};

/*
export const getPersona_IDNombre = async () => {
  try {
    const { data, error } = await restAPI.from("persona").select("id_persona, nombre").order("id_persona");

    if (error) {
      console.error("Error al obtener personas:", error);
      return { data: [], error };
    }

    const personas = data.map(persona => ({
      id: persona.id_persona,
      nombre: persona.nombre
    }));

    return { data: personas, error: null };
  } catch (err) {
    console.error("Error inesperado al obtener personas:", err);
    return { data: [], error: err };
  }
};
*/
