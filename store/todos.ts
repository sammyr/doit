import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

export interface Todo {
  id: string;
  description: string;
  deadline: string;
  priority: string;
  receiver: string;
  status: 'active' | 'inactive';
  created_at: string;
  user_id: string;
}

interface TodoInput {
  description: string;
  deadline: string;
  priority: string;
  receiver: string;
  status: 'active' | 'inactive';
}

interface TodoStore {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  fetchTodos: () => Promise<void>;
  addTodo: (todo: TodoInput) => Promise<void>;
  updateTodo: (id: string, updates: Partial<TodoInput>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
}

export const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  loading: false,
  error: null,

  fetchTodos: async () => {
    try {
      set({ loading: true, error: null });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Nicht eingeloggt');

      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Fehler beim Laden der Todos:', error);
        throw error;
      }

      set({ todos: data || [] });
    } catch (error: any) {
      const errorMessage = error.message || 'Ein unbekannter Fehler ist aufgetreten';
      console.error('Fehler beim Laden der Todos:', {
        message: errorMessage,
        error
      });
      set({ error: errorMessage });
      toast({
        title: "Fehler",
        description: `Fehler beim Laden der Todos: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      set({ loading: false });
    }
  },

  addTodo: async (todo: TodoInput) => {
    try {
      set({ loading: true, error: null });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Nicht eingeloggt');

      const { data, error } = await supabase
        .from('todos')
        .insert([{
          ...todo,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        todos: [data, ...state.todos],
      }));

      toast({
        title: "Erfolg",
        description: "Todo wurde erstellt",
      });
    } catch (error: any) {
      console.error('Fehler beim Erstellen des Todos:', error);
      set({ error: error.message });
      toast({
        title: "Fehler",
        description: "Todo konnte nicht erstellt werden",
        variant: "destructive",
      });
    } finally {
      set({ loading: false });
    }
  },

  updateTodo: async (id: string, updates: Partial<TodoInput>) => {
    try {
      set({ loading: true, error: null });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Nicht eingeloggt');

      const { error } = await supabase
        .from('todos')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      set((state) => ({
        todos: state.todos.map((todo) =>
          todo.id === id ? { ...todo, ...updates } : todo
        ),
      }));

      toast({
        title: "Erfolg",
        description: "Todo wurde aktualisiert",
      });
    } catch (error: any) {
      console.error('Fehler beim Aktualisieren des Todos:', error);
      set({ error: error.message });
      toast({
        title: "Fehler",
        description: "Todo konnte nicht aktualisiert werden",
        variant: "destructive",
      });
    } finally {
      set({ loading: false });
    }
  },

  deleteTodo: async (id: string) => {
    try {
      set({ loading: true, error: null });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Nicht eingeloggt');

      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      set((state) => ({
        todos: state.todos.filter((todo) => todo.id !== id),
      }));

      toast({
        title: "Erfolg",
        description: "Todo wurde gelöscht",
      });
    } catch (error: any) {
      console.error('Fehler beim Löschen des Todos:', error);
      set({ error: error.message });
      toast({
        title: "Fehler",
        description: "Todo konnte nicht gelöscht werden",
        variant: "destructive",
      });
    } finally {
      set({ loading: false });
    }
  },
}));
