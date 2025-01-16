import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  created_at: string;
}

interface ContactStore {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  fetchContacts: () => Promise<void>;
  addContact: (contact: Omit<Contact, 'id' | 'created_at'>) => Promise<void>;
}

export const useContactStore = create<ContactStore>((set) => ({
  contacts: [],
  loading: false,
  error: null,

  fetchContacts: async () => {
    try {
      set({ loading: true, error: null });

      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Fehler beim Laden der Kontakte:', error);
        throw error;
      }

      set({ contacts: data || [] });
    } catch (error: any) {
      const errorMessage = error.message || 'Ein unbekannter Fehler ist aufgetreten';
      console.error('Fehler beim Laden der Kontakte:', {
        message: errorMessage,
        error
      });
      set({ error: errorMessage });
      toast({
        title: "Fehler",
        description: `Fehler beim Laden der Kontakte: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      set({ loading: false });
    }
  },

  addContact: async (newContact) => {
    try {
      set({ loading: true, error: null });

      // Prüfe ob die E-Mail bereits existiert
      const { data: existingContact } = await supabase
        .from('contacts')
        .select('email')
        .eq('email', newContact.email)
        .single();

      if (existingContact) {
        throw new Error('Ein Kontakt mit dieser E-Mail existiert bereits');
      }

      // Füge den neuen Kontakt hinzu
      const { data, error } = await supabase
        .from('contacts')
        .insert([newContact])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        contacts: [data, ...state.contacts],
      }));

      toast({
        title: "Erfolg",
        description: "Kontakt wurde erstellt",
      });
    } catch (error: any) {
      console.error('Fehler beim Erstellen des Kontakts:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
