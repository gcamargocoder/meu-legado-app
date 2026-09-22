import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// A anon key é uma credencial pública por design (ela vai para o bundle do
// navegador) — não é um segredo a proteger. Quem de fato controla o acesso
// aos dados é o RLS no banco (ver supabase/migrations/20260921_init_schema.sql,
// hoje "deny all" por não haver autenticação real ainda).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
