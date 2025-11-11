import { createClient } from '@supabase/supabase-js';
import { ENV } from './env';

// Inicializar cliente de Supabase
const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export default supabase;
