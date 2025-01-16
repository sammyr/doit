import { createBrowserClient } from '@supabase/ssr';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Erstelle den Supabase-Client mit verbesserter Konfiguration
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    },
    global: {
      headers: {
        'X-Client-Info': 'justdoit-app'
      }
    },
    db: {
      schema: 'public'
    }
  }
);

// Funktion zum Neuladen des Schema-Cache
export const reloadSchemaCache = async () => {
  try {
    await supabase.schema.reload();
    console.log('Schema-Cache wurde erfolgreich neu geladen');
  } catch (error) {
    console.error('Fehler beim Neuladen des Schema-Cache:', error);
  }
};
