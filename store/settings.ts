import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

export interface Settings {
  id: string;
  user_id: string;
  theme: string;
  language: string;
  notifications_enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

interface SettingsState {
  settings: Settings | null;
  isLoading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  isLoading: false,
  error: null,

  fetchSettings: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Nicht eingeloggt');

      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      // Wenn keine Einstellungen gefunden wurden, erstelle Standardeinstellungen
      if (!data) {
        const { data: newSettings, error: createError } = await supabase
          .from('settings')
          .insert([{
            user_id: user.id,
            theme: 'light',
            language: 'de',
            notifications_enabled: true
          }])
          .select()
          .single();

        if (createError) throw createError;
        set({ settings: newSettings, isLoading: false });
        return;
      }

      set({ settings: data, isLoading: false });
    } catch (error) {
      console.error('Fehler beim Laden der Einstellungen:', error);
      set({ error: 'Einstellungen konnten nicht geladen werden', isLoading: false });
      toast.error('Einstellungen konnten nicht geladen werden');
    }
  },

  updateSettings: async (newSettings: Partial<Settings>) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Nicht eingeloggt');

      const { data, error } = await supabase
        .from('settings')
        .update({
          ...newSettings,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      set({ settings: data, isLoading: false });
      toast.success('Einstellungen wurden gespeichert');
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Einstellungen:', error);
      set({ error: 'Einstellungen konnten nicht aktualisiert werden', isLoading: false });
      toast.error('Einstellungen konnten nicht gespeichert werden');
    }
  }
}));
