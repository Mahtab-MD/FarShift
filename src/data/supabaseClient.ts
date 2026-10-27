/**
 * Supabase client initialization module.
 * Reads credentials strictly from Vite environment variables with zero hardcoded secrets.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * Checks whether both Supabase URL and Anon Key are configured and valid.
 *
 * @param {string | undefined} url - VITE_SUPABASE_URL value
 * @param {string | undefined} key - VITE_SUPABASE_ANON_KEY value
 * @returns {boolean} True if credentials are non-empty and use HTTPS
 */
function checkSupabaseCredentials(url: string | undefined, key: string | undefined): boolean {
  if (!url || !key) return false;
  return url.trim().length > 0 && key.trim().length > 0 && url.startsWith('https://');
}

export const hasSupabaseConfig: boolean = checkSupabaseCredentials(supabaseUrl, supabaseAnonKey);

export const supabase: SupabaseClient | null =
  hasSupabaseConfig && supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
