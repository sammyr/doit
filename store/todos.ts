import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

export interface Todo {
  id: string;
  description: string;
  deadline?: string;
  priority?: string;
  receiver?: string;
  status: 'active' | 'completed';
  user_id: string;
  created_at: string;
}

interface TodoStore {
  todos: Todo[];
  error: string | null;
  fetchTodos: () => Promise<void>;
  addTodo: (todo: Omit<Todo, 'id' | 'created_at' | 'user_id' | 'status'>) => Promise<void>;
  updateTodo: (id: string, updates: Partial<Omit<Todo, 'id' | 'created_at' | 'user_id'>>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  completeTodo: (id: string) => Promise<void>;
}

export const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  error: null,

  fetchTodos: async () => {
    try {
      set({ error: null });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Nicht eingeloggt');

      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ todos: data || [] });
    } catch (error: any) {
      const errorMessage = error.message || 'Ein unbekannter Fehler ist aufgetreten';
      console.error('Fehler beim Laden der Todos:', error);
      set({ error: errorMessage });
      toast({
        title: "Fehler",
        description: `Fehler beim Laden der Todos: ${errorMessage}`,
        variant: "destructive",
      });
    }
  },

  addTodo: async (todo) => {
    try {
      console.log('Füge neues Todo hinzu:', todo); // Debug-Log

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Nicht eingeloggt');

      const newTodo = {
        ...todo,
        user_id: user.id,
        status: 'active' as const,
        created_at: new Date().toISOString()
      };

      console.log('Sende Todo an Supabase:', newTodo); // Debug-Log

      const { data, error } = await supabase
        .from('todos')
        .insert([newTodo])
        .select()
        .single();

      if (error) {
        console.error('Supabase Fehler:', error); // Debug-Log
        throw error;
      }

      console.log('Todo erfolgreich erstellt:', data); // Debug-Log

      set((state) => ({
        todos: [data, ...state.todos]
      }));

      toast({
        title: "Erfolg",
        description: "Todo wurde erfolgreich hinzugefügt",
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Ein unbekannter Fehler ist aufgetreten';
      console.error('Fehler beim Hinzufügen des Todos:', error);
      set({ error: errorMessage });
      toast({
        title: "Fehler",
        description: `Fehler beim Hinzufügen des Todos: ${errorMessage}`,
        variant: "destructive",
      });
      throw error;
    }
  },

  updateTodo: async (id, updates) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Nicht eingeloggt');

      const { data, error } = await supabase
        .from('todos')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        todos: state.todos.map((todo) =>
          todo.id === id ? data : todo
        )
      }));

      toast({
        title: "Erfolg",
        description: "Todo wurde erfolgreich aktualisiert",
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Ein unbekannter Fehler ist aufgetreten';
      console.error('Fehler beim Aktualisieren des Todos:', error);
      set({ error: errorMessage });
      toast({
        title: "Fehler",
        description: `Fehler beim Aktualisieren des Todos: ${errorMessage}`,
        variant: "destructive",
      });
      throw error;
    }
  },

  deleteTodo: async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Nicht eingeloggt');

      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      set((state) => ({
        todos: state.todos.filter((todo) => todo.id !== id)
      }));

      toast({
        title: "Erfolg",
        description: "Todo wurde erfolgreich gelöscht",
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Ein unbekannter Fehler ist aufgetreten';
      console.error('Fehler beim Löschen des Todos:', error);
      set({ error: errorMessage });
      toast({
        title: "Fehler",
        description: `Fehler beim Löschen des Todos: ${errorMessage}`,
        variant: "destructive",
      });
      throw error;
    }
  },

  completeTodo: async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Nicht eingeloggt');

      const { data, error } = await supabase
        .from('todos')
        .update({ status: 'completed' })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        todos: state.todos.map((todo) =>
          todo.id === id ? data : todo
        )
      }));

      toast({
        title: "Erfolg",
        description: "Todo wurde als erledigt markiert",
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Ein unbekannter Fehler ist aufgetreten';
      console.error('Fehler beim Markieren des Todos als erledigt:', error);
      set({ error: errorMessage });
      toast({
        title: "Fehler",
        description: `Fehler beim Markieren des Todos als erledigt: ${errorMessage}`,
        variant: "destructive",
      });
      throw error;
    }
  }
}));
