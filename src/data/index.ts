import { IDataSource } from './database.interface.ts';
import { LocalDataSource } from './localDataSource.ts';
import { SupabaseDataSource } from './supabaseDataSource.ts';
import { hasSupabaseConfig } from './supabaseClient.ts';

// Singleton instance: if Supabase environment variables are provided, use Supabase;
// otherwise fall back seamlessly to LocalDataSource (labeled as sample mode).
export const dataSource: IDataSource = hasSupabaseConfig
  ? new SupabaseDataSource()
  : new LocalDataSource();

export const isSampleMode = dataSource.isSampleMode;
