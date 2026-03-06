import { getSupabase } from "./supabase/client";

const mapError = (error) => {
  if (!error) return null;
  const mapped = new Error(error.message || "Supabase error");
  return mapped;
};

const list = async (table, order, limit) => {
  const supabase = getSupabase();
  let query = supabase.from(table).select("*");
  if (order) {
    const direction = order.startsWith("-") ? "desc" : "asc";
    const column = order.replace("-", "");
    query = query.order(column, { ascending: direction === "asc" });
  }
  if (limit) {
    query = query.limit(limit);
  }
  const { data, error } = await query;
  if (error) throw mapError(error);
  return data ?? [];
};

const filter = async (table, filters, order, limit) => {
  const supabase = getSupabase();
  let query = supabase.from(table).select("*");
  Object.entries(filters || {}).forEach(([key, value]) => {
    query = query.eq(key, value);
  });
  if (order) {
    const direction = order.startsWith("-") ? "desc" : "asc";
    const column = order.replace("-", "");
    query = query.order(column, { ascending: direction === "asc" });
  }
  if (limit) {
    query = query.limit(limit);
  }
  const { data, error } = await query;
  if (error) throw mapError(error);
  return data ?? [];
};

const create = async (table, payload) => {
  const supabase = getSupabase();
  const { data, error } = await supabase.from(table).insert(payload).select("*").single();
  if (error) throw mapError(error);
  return data;
};

const update = async (table, id, payload) => {
  const supabase = getSupabase();
  const { data, error } = await supabase.from(table).update(payload).eq("id", id).select("*").single();
  if (error) throw mapError(error);
  return data;
};

const remove = async (table, id) => {
  const supabase = getSupabase();
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw mapError(error);
  return true;
};

const uploadFile = async ({ file, type }) => {
  const supabase = getSupabase();
  const bucket = "admin-listings"; // Use the existing 'admin-listings' bucket
  const folder = type === "logo" ? "logos" : "banners"; // Determine subfolder based on type
  const filePath = `${folder}/${Date.now()}-${file.name}`;
  
  try {
    const { error } = await supabase.storage.from(bucket).upload(filePath, file);
    if (error) {
      throw mapError(error);
    }
    
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return { file_url: data.publicUrl };
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export const pacificMarket = {
  auth: {
    me: async () => {
      const supabase = getSupabase();
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) throw mapError(authError);
      
      if (!authData?.user) return null;
      
      // Fetch user profile to get role and display_name
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role, display_name')
        .eq('id', authData.user.id)
        .single();
      
      if (profileError) {
        // If profile doesn't exist, return user with metadata and role: null
        console.warn('Profile not found for user:', authData.user.id);
        return { 
          ...authData.user, 
          role: null,
          full_name: authData.user.user_metadata?.full_name || authData.user.user_metadata?.display_name,
          display_name: authData.user.user_metadata?.display_name || authData.user.user_metadata?.full_name
        };
      }
      
      return { 
        ...authData.user, 
        role: profileData.role, // Now 'owner' or 'admin'
        full_name: profileData.display_name || authData.user.user_metadata?.full_name || authData.user.user_metadata?.display_name,
        display_name: profileData.display_name || authData.user.user_metadata?.display_name || authData.user.user_metadata?.full_name
      };
    },
    signIn: async (email, password) => {
      const supabase = getSupabase();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      return { data, error };
    },
    signUp: async (email, password, options = {}) => {
      const supabase = getSupabase();
      // Use data object to avoid triggering database issues
      const signUpOptions = {
        email, 
        password,
        options: {
          data: {
            // Add minimal metadata to avoid trigger issues
            signup_source: 'business_onboarding',
            ...options.data
          }
        }
      };
      const { data, error } = await supabase.auth.signUp(signUpOptions);
      return { data, error };
    },
    logout: async () => {
      const supabase = getSupabase();
      const { error } = await supabase.auth.signOut();
      if (error) throw mapError(error);
    },
    redirectToLogin: () => {},
  },
  entities: {
    Business: {
      list: (order, limit) => list("businesses", order, limit),
      filter: (filters, order, limit) => filter("businesses", filters, order, limit),
      create: (payload) => create("businesses", payload),
      update: (id, payload) => update("businesses", id, payload),
      delete: (id) => remove("businesses", id),
    },
    ClaimRequest: {
      list: (order, limit) => list("claim_requests", order, limit),
      filter: (filters, order, limit) => filter("claim_requests", filters, order, limit),
      create: (payload) => create("claim_requests", payload),
      update: (id, payload) => update("claim_requests", id, payload),
    },
    AdminUser: {
      list: (order, limit) => list("admin_users", order, limit),
      filter: (filters, order, limit) => filter("admin_users", filters, order, limit),
    },
    BusinessImage: {
      filter: (filters, order, limit) => filter("business_images", filters, order, limit),
    },
    ProductService: {
      filter: (filters, order, limit) => filter("product_services", filters, order, limit),
    },
  },
  integrations: {
    Core: {
      UploadFile: uploadFile,
    },
  },
  functions: {
    invoke: async (name, payload) => {
      const response = await fetch(`/api/emails/${name}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Failed to invoke ${name}`);
      }
      return response.json();
    },
  },
};
