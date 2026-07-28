import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Cookie-free Supabase client for public, cacheable pages.
 *
 * `createClient` in `./server.ts` reads `cookies()`, which opts the whole route
 * into dynamic rendering — every visit then pays a round trip to Supabase before
 * the first byte. Public content (blog posts, projects, the home page) is the
 * same for everyone and is protected by RLS anyway, so it does not need the
 * caller's session. Using this client instead lets those routes be prerendered
 * and revalidated on a schedule.
 */
export function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}
