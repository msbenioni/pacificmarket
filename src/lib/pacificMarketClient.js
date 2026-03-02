import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const getSupabase = () => {
  const client = createSupabaseBrowserClient();
  if (!client) {
    throw new Error("Missing Supabase environment variables.");
  }
  return client;
};

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

const uploadFile = async ({ file }) => {
  const supabase = getSupabase();
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "public";
  const filePath = `uploads/${Date.now()}-${file.name}`;
  const { error } = await supabase.storage.from(bucket).upload(filePath, file);
  if (error) throw mapError(error);
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return { file_url: data.publicUrl };
};

export const pacificMarket = {
  auth: {
    me: async () => {
      const supabase = getSupabase();
      const { data, error } = await supabase.auth.getUser();
      if (error) throw mapError(error);
      return data?.user ?? null;
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
    BusinessOwner: {
      list: (order, limit) => list("business_owners", order, limit),
      filter: (filters, order, limit) => filter("business_owners", filters, order, limit),
      create: (payload) => create("business_owners", payload),
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
