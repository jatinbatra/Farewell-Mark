
import { createClient } from '@supabase/supabase-js';

// Helper to safely access process.env without crashing if process is undefined
const getEnv = (key: string): string => {
  try {
    return (typeof process !== 'undefined' && process.env) ? process.env[key] || '' : '';
  } catch {
    return '';
  }
};

// Use provided keys as fallbacks if environment variables are not set
const supabaseUrl = getEnv('SUPABASE_URL') || 'https://zsxkjdvzxseslxskbnas.supabase.co';
const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzeGtqZHZ6eHNlc2x4c2tibmFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMTg4MDgsImV4cCI6MjA4NDU5NDgwOH0.tQ9qE7G9ezO8L5cqXojM-X_uQCIQfgzJuOKKO9rLpis';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('YOUR_'));

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any;
