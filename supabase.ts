
import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string): string => {
  try {
    return (typeof process !== 'undefined' && process.env) ? process.env[key] || '' : '';
  } catch {
    return '';
  }
};

const supabaseUrl = getEnv('SUPABASE_URL');
const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY');

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (isSupabaseConfigured) {
  console.log("Supabase initialized with URL:", supabaseUrl);
} else {
  console.warn("Supabase credentials missing. Check your environment variables.");
}

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any;
