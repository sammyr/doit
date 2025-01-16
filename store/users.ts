import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  created_at: string;
}

interface UserStore {
  users: User[];
  currentUser: SupabaseUser | null;
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  currentUser: null,
  loading: false,
  error: null,

  fetchCurrentUser: async () => {
    try {
      set({ loading: true, error: null });
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      set({ currentUser: user });
    } catch (error: any) {
      console.error('Fehler beim Laden des aktuellen Benutzers:', error);
      set({ error: error.message || 'Ein Fehler ist aufgetreten' });
      toast({
        title: "Fehler",
        description: "Aktueller Benutzer konnte nicht geladen werden",
        variant: "destructive",
      });
    } finally {
      set({ loading: false });
    }
  },

  fetchUsers: async () => {
    try {
      set({ loading: true, error: null });

      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Fehler beim Laden der Benutzer:', error);
        throw error;
      }

      set({ users: data || [] });
    } catch (error: any) {
      const errorMessage = error.message || 'Ein unbekannter Fehler ist aufgetreten';
      console.error('Fehler beim Laden der Benutzer:', {
        message: errorMessage,
        error
      });
      set({ error: errorMessage });
      toast({
        title: "Fehler",
        description: `Fehler beim Laden der Benutzer: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      set({ loading: false });
    }
  },
}));
