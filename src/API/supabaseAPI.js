import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseKey)

export const fetchPersonas = async () => {
    return supabase.from("persona").select("*");
};

export const eliminarPersonaAPI = async (id) => {
    return supabase.from("persona").delete().eq("id", id);
};

