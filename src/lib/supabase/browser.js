import { createClient } from "@supabase/supabase-js";

export const createSupabaseBrowserClient = () =>
  {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const redirectUrl = process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL;
    
    if (!url || !key) return null;
    
    const clientOptions = {
      auth: {
        persistSession: true,
        detectSessionInUrl: true,
      }
    };
    
    return createClient(url, key, clientOptions);
  };
