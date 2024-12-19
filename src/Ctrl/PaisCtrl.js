import { restAPI } from "../API/postgRestAPI";
import { deleteDepartamento } from "./DepartamentoCtrl";

export const readAllPais = async () => {
  try {
    const { data, error } = await restAPI.from("pais").select("*").order("id_pais");
    
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
    const { data, error } = await restAPI.from("pais").select("*").eq("id_pais", id);
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
    // Obtener todos los departamentos que pertenecen al país
    const { data: departamentos, error: departamentosError } = await restAPI.from("departamento").select("*").eq("paisid", id);
    if (departamentosError) {
      console.error("Error al obtener los departamentos:", departamentosError);
      return { data: [], error: departamentosError };
    }

    // Eliminar cada departamento relacionado con el país
    for (let departamento of departamentos) {
      const { error: deleteDeptError } = await deleteDepartamento(departamento.id_departamento)
      if (deleteDeptError) {
        console.error(`Error al eliminar el departamento con ID ${departamento.id_departamento}:`, deleteDeptError);
        return { data: [], error: deleteDeptError };
      }
    }

    // Eliminar el país después de eliminar sus departamentos
    const { data, error } = await restAPI.from("pais").delete().eq("id_pais", id);
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
    const { data, error } = await restAPI.from("pais").insert(pais);

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
    const { data, error } = await restAPI.from("pais").update(updates).eq("id_pais", id);
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
