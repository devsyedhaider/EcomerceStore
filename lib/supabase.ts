import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl.includes('supabase.co'))
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!supabase) {
  console.warn('⚠️ Supabase connection is NOT active (missing or invalid credentials). Local fallback in use.');
} else {
  // Adding a silent connectivity check to avoid red indicators if DNA fails
  supabase.from('products').select('id', { count: 'exact', head: true }).then(({ error }) => {
    if (error) {
      console.warn('⚠️ Supabase URL reachable but returned error (Check if project is active):', error.message);
    }
  });
}
