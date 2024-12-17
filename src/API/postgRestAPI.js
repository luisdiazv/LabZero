import { createClient } from "@supabase/supabase-js";

const RestAPIUrl = process.env.REACT_APP_SUPABASE_URL
const RestAPIKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const restAPI = createClient(RestAPIUrl, RestAPIKey)



