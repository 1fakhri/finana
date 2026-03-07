import { createClient } from "@supabase/supabase-js";

// Fallback values allow static export (next build) to succeed without env vars.
// Auth calls will fail at runtime if real values aren't provided.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
