import { createClient } from "@supabase/supabase-js";

export const createSupabaseBrowserClient = () =>
  {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!url || !key) return null;
    
    const clientOptions = {
      auth: {
        persistSession: true,
        detectSessionInUrl: true,
        autoRefreshToken: true,
        debug: process.env.NODE_ENV === 'development',
      }
    };
    
    return createClient(url, key, clientOptions);
  };
