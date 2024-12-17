import { restAPI } from "../API/postgRestAPI";

export const readAllPersona = async () => {
  try {
    const { data, error } = await restAPI.from("persona").select("*").order("id_persona");

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

export const readPersona = async (id) => {
  try {
    const { data, error } = await restAPI.from("persona").select("*").eq("id_persona", id);
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
    // COMIENZA LA SIMULACION -> Permite preveer errores antes de eliminar/modificar otros registros de otras tablas en la BD
    console.warn(`Iniciando transacción para la persona con ID ${id}`);

    const transaccion = [
      restAPI.from("pais").update({ presidenteid: null }).eq("presidenteid", id),
      restAPI.from("departamento").update({ gobernadorid: null }).eq("gobernadorid", id),
      restAPI.from("municipio").update({ alcaldeid: null }).eq("alcaldeid", id),
      restAPI.from("persona").update({ cabezafamilia: null }).eq("cabezafamilia", id),
    ];

    const resultadoTransaccion = await Promise.all(transaccion);

    for (let i = 0; i < resultadoTransaccion.length; i++) {
      const { error } = resultadoTransaccion[i];
      if (error) {
        console.warn(`Error detectado en la simulación de actualización en la tabla ${i + 1}:`, error);
        return { data: [], error: `Simulación fallida en la tabla ${i + 1}` };
      }
    }

    const { error: errorTransaccionPersonaVivienda } = await restAPI.from("persona_vivienda").delete().eq("propietariaid", id);
    if (errorTransaccionPersonaVivienda) {
      console.error(`Error detectado en la simulación de eliminación en Persona_Vivienda:`, errorTransaccionPersonaVivienda);
      return { data: [], error: `Simulación fallida en Persona_Vivienda` };
    }

    console.info("Transaccion completada exitosamente. Procediendo con los cambios...");
    // FINALIZA LA SIMULACION -> Inicia el delete

    // Modifica las referencias en tablas con FK de persona que permitan null
    const definitiveUpdates = [
      restAPI.from("pais").update({ presidenteid: null }).eq("presidenteid", id),
      restAPI.from("departamento").update({ gobernadorid: null }).eq("gobernadorid", id),
      restAPI.from("municipio").update({ alcaldeid: null }).eq("alcaldeid", id),
      restAPI.from("persona").update({ cabezafamilia: null }).eq("cabezafamilia", id),
    ];

    const definitiveResults = await Promise.all(definitiveUpdates);

    definitiveResults.forEach(({ error }, index) => {
      if (error) console.warn(`Error en la actualización definitiva en la tabla ${index + 1}:`, error);
    });

    // Elimina las referencias en tablas con FK de persona que permitan null
    const { error: errorRefsDef } = await restAPI.from("persona_vivienda").delete().eq("propietariaid", id);

    if (errorRefsDef) {
      console.error(`Error eliminando referencias definitivas en Persona_Vivienda:`, errorRefsDef);
      return { data: [], error: errorRefsDef };
    }

    // Eliminar la persona
    const { data, error } = await restAPI.from("persona").delete().eq("id_persona", id);

    if (error) {
      console.error(`Error al eliminar persona con ID ${id}:`, error);
      return { data: [], error };
    }

    console.log(`Persona con ID ${id} eliminada correctamente.`);
    return { data, error: null };

  } catch (err) {
    console.error(`Error inesperado al eliminar persona con ID ${id}:`, err);
    return { data: [], error: err };
  }
  
};

export const createPersona = async (persona) => {
  try {
    if (persona.cabezafamilia) {
      // Validar que la persona asignada como cabezafamilia no sea ya un cabezafamilia
      const { data: existingHead, error: validationError } = await restAPI.from("persona").select("id_persona").eq("cabezafamilia", persona.cabezafamilia);

      if (validationError) {
        console.error("Error validando cabezafamilia:", validationError);
        return { data: null, error: "Error validando cabezafamilia" };
      }

      if (existingHead.length > 0) {
        return {
          data: null,
          error: `La persona seleccionada como cabezafamilia (${persona.cabezafamilia}) ya es cabezafamilia de otra persona.`,
        };
      }
    }

    // Si la validación pasa, insertar la persona
    const { data, error } = await restAPI.from("persona").insert(persona);

    if (error) {
      console.error("Error al crear persona:", error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Error inesperado al crear persona:", err);
    return { data: null, error: err };
  }
};

export const updatePersona = async (id, updates) => {
  try {
    if (updates.cabezafamilia) {
      // Validar que la persona asignada como cabezafamilia no sea ya un cabezafamilia
      const { data: existingHead, error: validationError } = await restAPI
        .from("persona")
        .select("id_persona")
        .eq("cabezafamilia", updates.cabezafamilia);

      if (validationError) {
        console.error("Error validando cabezafamilia:", validationError);
        return { data: null, error: "Error validando cabezafamilia" };
      }

      if (existingHead.length > 0) {
        return {
          data: null,
          error: `La persona seleccionada como cabezafamilia (${updates.cabezafamilia}) ya es cabezafamilia de otra persona.`,
        };
      }
    }

    // Si la validación pasa, actualizar la persona
    const { data, error } = await restAPI.from("persona").update(updates).eq("id_persona", id);

    if (error) {
      console.error(`Error al modificar persona con ID ${id}:`, error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error(`Error inesperado al modificar persona con ID ${id}:`, err);
    return { data: null, error: err };
  }
};

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
