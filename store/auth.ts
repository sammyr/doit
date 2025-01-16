import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

interface AuthState {
  user: any | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean }>;
  signOut: () => Promise<void>;
  checkSession: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  signIn: async (email: string, password: string, rememberMe = false) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          persistSession: rememberMe // Session nur speichern wenn "Angemeldet bleiben" aktiviert ist
        }
      });

      if (error) throw error;

      set({ user: data.user });
      toast({
        title: "Erfolgreich angemeldet",
        description: "Willkommen zurück!",
      });
      return { success: true };
    } catch (error: any) {
      set({ error: error.message });
      toast({
        title: "Fehler beim Anmelden",
        description: error.message,
        variant: "destructive",
      });
      return { success: false };
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      set({ user: null });
      toast({
        title: "Erfolgreich abgemeldet",
        description: "Auf Wiedersehen!",
      });
    } catch (error: any) {
      set({ error: error.message });
      toast({
        title: "Fehler beim Abmelden",
        description: error.message,
        variant: "destructive",
      });
    }
  },

  checkSession: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({ user: session?.user || null });
      return !!session;
    } catch (error: any) {
      set({ error: error.message });
      return false;
    }
  }
}));

// Auth state listener
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    useAuthStore.setState({ user: session?.user || null, loading: false });
  } else if (event === 'SIGNED_OUT') {
    useAuthStore.setState({ user: null, loading: false });
  }
});
