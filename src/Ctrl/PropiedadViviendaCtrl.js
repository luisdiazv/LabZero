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

export const readPropiedadVivienda = async (id1, id2) => {
  try {
    const { data, error } = await restAPI.from("propiedad_vivienda").select("*").eq("propietariaid", id1).eq("viviendaid", id2);
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

export const deletePropiedadvivienda = async (id1 , id2) => {
  try {
    const { data, error } = await supabase.from("propiedad_vivienda").delete().eq("propietariaid", id1).eq("viviendaid", id2);
    if (error) {
      console.error("Error al eliminar proviedad_vivienda con propietariaID ${id1} y viviendaID ${id2}:", error);
      return { data: [], error };
    }
    return { data, error: null };
  } catch (err) {
    console.error("Error inesperado al eliminar proviedad_vivienda con propietariaID ${id1} y viviendaID ${id2}:", err);
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

export const updatePropiedadVivienda = async (id1, id2, updates) => {
  try {

      const { data, error } = await restAPI.from("propiedad_vivienda").update(updates).eq("propietariaid", id1).eq("viviendaid", id2);;

      if (error) {
          console.error(`Error al modificar propiedad_vivienda con propietariaid ${id1} y viviendaid ${id2}:`, error);
          return { data: null, error };
      }

      return { data, error: null };
  } catch (err) {
      console.error(`Error inesperado al modificar propiedad_vivienda con propietariaid ${id1} y viviendaid ${id2}:`, err);
      return { data: null, error: err };
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
