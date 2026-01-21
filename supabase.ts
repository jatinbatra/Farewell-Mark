
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

// If keys aren't provided, we'll log a warning but the app won't crash 
// (it will just fail to fetch until keys are added to Vercel)
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing! Please add SUPABASE_URL and SUPABASE_ANON_KEY to your environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
