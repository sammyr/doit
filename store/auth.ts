import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface AuthState {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; message: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: { name?: string; email?: string }) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,

  signUp: async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        if (error.message === 'Email not confirmed') {
          toast.error('Bitte bestätigen Sie Ihre E-Mail-Adresse');
          return { success: false, message: 'Bitte bestätigen Sie Ihre E-Mail-Adresse' };
        }
        toast.error(error.message);
        return { success: false, message: error.message };
      }
      
      if (data.user) {
        set({ user: data.user });
        toast.success('Registrierung erfolgreich! Bitte prüfen Sie Ihre E-Mails für den Bestätigungslink.');
        return { success: true, message: 'Registrierung erfolgreich!' };
      }

      return { success: false, message: 'Unbekannter Fehler bei der Registrierung' };
    } catch (error: any) {
      toast.error(error.message || 'Ein Fehler ist aufgetreten');
      return { success: false, message: error.message || 'Ein Fehler ist aufgetreten' };
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      const { data: { session, user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        if (error.message === 'Email not confirmed') {
          toast.error('Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse');
          return { success: false, message: 'Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse' };
        }
        toast.error(error.message);
        return { success: false, message: error.message };
      }
      
      if (user && session) {
        set({ user, loading: false });
        toast.success('Erfolgreich eingeloggt!');
        return { success: true, message: 'Erfolgreich eingeloggt!' };
      }

      return { success: false, message: 'Unbekannter Fehler beim Login' };
    } catch (error: any) {
      toast.error(error.message || 'Ein Fehler ist aufgetreten');
      return { success: false, message: error.message || 'Ein Fehler ist aufgetreten' };
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
        throw error;
      }
      set({ user: null });
      toast.success('Erfolgreich ausgeloggt!');
    } catch (error: any) {
      toast.error(error.message || 'Fehler beim Ausloggen');
      throw error;
    }
  },

  resetPassword: async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) {
        toast.error(error.message);
        throw error;
      }
      toast.success('Passwort-Reset E-Mail wurde gesendet!');
    } catch (error: any) {
      toast.error(error.message || 'Fehler beim Zurücksetzen des Passworts');
      throw error;
    }
  },

  updateProfile: async (data) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data,
      });
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      const user = get().user;
      if (user) {
        set({
          user: {
            ...user,
            user_metadata: {
              ...user.user_metadata,
              ...data,
            },
          },
        });
        toast.success('Profil erfolgreich aktualisiert!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Fehler beim Aktualisieren des Profils');
      throw error;
    }
  },
}));

// Auth state listener
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    useAuthStore.setState({ user: session?.user || null, loading: false });
  } else if (event === 'SIGNED_OUT') {
    useAuthStore.setState({ user: null, loading: false });
  }
});
