// Client-side Supabase client for Next.js (using SSR package)
// This uses @supabase/ssr which is SSR-safe and doesn't access localStorage during module load
import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
export const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Singleton instance - createBrowserClient from @supabase/ssr is SSR-safe
let _supabaseClient: SupabaseClient<Database> | undefined;

// Get the client instance (SSR-safe with @supabase/ssr)
function getClient(): SupabaseClient<Database> {
  if (!_supabaseClient && typeof window !== 'undefined') {
    _supabaseClient = createBrowserClient<Database>(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY
    );
  }
  
  // Return mock client for SSR
  return _supabaseClient || ({} as SupabaseClient<Database>);
}

// Export the client - @supabase/ssr handles SSR safely
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_target, prop) {
    const client = getClient();
    const value = client[prop as keyof typeof client];
    return typeof value === 'function' ? value.bind(client) : value;
  }
});