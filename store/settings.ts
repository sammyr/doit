import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

export interface Settings {
  id: string;
  user_id: string;
  sender_email: string | null;
  email_template: string | null;
  created_at: string;
}

interface SettingsStore {
  settings: Settings | null;
  loading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: null,
  loading: false,
  error: null,

  fetchSettings: async () => {
    try {
      set({ loading: true, error: null });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Nicht eingeloggt');

      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      set({ settings: data });
    } catch (error: any) {
      console.error('Fehler beim Laden der Einstellungen:', error);
      set({ error: error.message });
      toast({
        title: "Fehler",
        description: `Fehler beim Laden der Einstellungen: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      set({ loading: false });
    }
  },

  updateSettings: async (newSettings) => {
    try {
      set({ loading: true, error: null });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Nicht eingeloggt');

      const existingSettings = await supabase
        .from('settings')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      let result;
      
      if (existingSettings.data) {
        // Update
        result = await supabase
          .from('settings')
          .update({
            ...newSettings,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .select()
          .single();
      } else {
        // Insert
        result = await supabase
          .from('settings')
          .insert([{
            ...newSettings,
            user_id: user.id
          }])
          .select()
          .single();
      }

      if (result.error) throw result.error;

      set({ settings: result.data });
      toast({
        title: "Erfolg",
        description: "Einstellungen wurden erfolgreich gespeichert",
      });
    } catch (error: any) {
      console.error('Fehler beim Speichern der Einstellungen:', error);
      set({ error: error.message });
      toast({
        title: "Fehler",
        description: `Fehler beim Speichern der Einstellungen: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      set({ loading: false });
    }
  }
}));
