import { createSupabaseBrowserClient } from "./browser";

let supabaseClient = null;

export const getSupabase = () => {
  if (supabaseClient) return supabaseClient;
  
  const client = createSupabaseBrowserClient();
  if (!client) {
    throw new Error("Missing Supabase environment variables.");
  }
  
  supabaseClient = client;
  return supabaseClient;
};
