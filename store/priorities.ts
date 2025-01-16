import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

export interface Priority {
  id: string;
  name: string;
  email_notification: boolean;
  sms_notification: boolean;
  whatsapp_notification: boolean;
  user_id: string;
  created_at: string;
}

interface PriorityStore {
  priorities: Priority[];
  loading: boolean;
  error: string | null;
  fetchPriorities: () => Promise<void>;
  addPriority: (priority: Omit<Priority, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
  updatePriority: (id: string, updates: Partial<Omit<Priority, 'id' | 'created_at' | 'user_id'>>) => Promise<void>;
  deletePriority: (id: string) => Promise<void>;
}

export const usePriorityStore = create<PriorityStore>((set) => ({
  priorities: [],
  loading: false,
  error: null,

  fetchPriorities: async () => {
    try {
      set({ loading: true, error: null });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Nicht eingeloggt');

      const { data, error } = await supabase
        .from('priorities')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true });

      if (error) {
        console.error('Fehler beim Laden der Prioritäten:', error);
        throw error;
      }

      set({ priorities: data || [] });
    } catch (error: any) {
      const errorMessage = error.message || 'Ein unbekannter Fehler ist aufgetreten';
      console.error('Fehler beim Laden der Prioritäten:', {
        message: errorMessage,
        error
      });
      set({ error: errorMessage });
      toast({
        title: "Fehler",
        description: `Fehler beim Laden der Prioritäten: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      set({ loading: false });
    }
  },

  addPriority: async (priority) => {
    try {
      set({ loading: true, error: null });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Nicht eingeloggt');

      const { data, error } = await supabase
        .from('priorities')
        .insert([{ ...priority, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        priorities: [...state.priorities, data]
      }));

      toast({
        title: "Erfolg",
        description: "Priorität wurde erfolgreich hinzugefügt",
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Ein unbekannter Fehler ist aufgetreten';
      console.error('Fehler beim Hinzufügen der Priorität:', error);
      set({ error: errorMessage });
      toast({
        title: "Fehler",
        description: `Fehler beim Hinzufügen der Priorität: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      set({ loading: false });
    }
  },

  updatePriority: async (id, updates) => {
    try {
      set({ loading: true, error: null });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Nicht eingeloggt');

      const { data, error } = await supabase
        .from('priorities')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        priorities: state.priorities.map((priority) =>
          priority.id === id ? data : priority
        )
      }));

      toast({
        title: "Erfolg",
        description: "Priorität wurde erfolgreich aktualisiert",
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Ein unbekannter Fehler ist aufgetreten';
      console.error('Fehler beim Aktualisieren der Priorität:', error);
      set({ error: errorMessage });
      toast({
        title: "Fehler",
        description: `Fehler beim Aktualisieren der Priorität: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      set({ loading: false });
    }
  },

  deletePriority: async (id: string) => {
    try {
      set({ loading: true, error: null });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Nicht eingeloggt');

      const { error } = await supabase
        .from('priorities')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      set((state) => ({
        priorities: state.priorities.filter((priority) => priority.id !== id)
      }));

      toast({
        title: "Erfolg",
        description: "Priorität wurde erfolgreich gelöscht",
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Ein unbekannter Fehler ist aufgetreten';
      console.error('Fehler beim Löschen der Priorität:', error);
      set({ error: errorMessage });
      toast({
        title: "Fehler",
        description: `Fehler beim Löschen der Priorität: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      set({ loading: false });
    }
  }
}));
