"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, Pencil, Trash2 } from "lucide-react";
import { useUserStore } from "@/store/users";
import { usePriorityStore } from "@/store/priorities";
import { useTodoStore, Todo } from "@/store/todos";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";

// Hilfsfunktion für die Generierung einer UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default function TodosPage() {
  const { currentUser } = useUserStore();
  const { priorities, fetchPriorities } = usePriorityStore();
  const { 
    todos, 
    error, 
    fetchTodos, 
    addTodo, 
    updateTodo, 
    deleteTodo,
    completeTodo 
  } = useTodoStore();
  const { users, fetchUsers } = useUserStore();
  
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [priority, setPriority] = useState("");
  const [receiver, setReceiver] = useState("");
  const [todoToDelete, setTodoToDelete] = useState<string | null>(null);
  const [localTodos, setLocalTodos] = useState<Todo[]>([]);

  // Initialisiere localTodos wenn sich todos ändert
  useEffect(() => {
    setLocalTodos(todos);
  }, [todos]);

  useEffect(() => {
    fetchTodos();
    fetchUsers();
    fetchPriorities();
  }, [fetchTodos, fetchUsers, fetchPriorities]);

  const handleAddTodo = async () => {
    try {
      if (!description.trim()) {
        toast({
          title: "Fehler",
          description: "Bitte geben Sie eine Beschreibung ein",
          variant: "destructive",
        });
        return;
      }

      console.log('Starte Todo-Erstellung mit:', { 
        description,
        deadline: selectedDate?.toISOString(),
        priority,
        receiver,
        status: 'active'
      });

      // Optimistisches Update
      const tempId = generateUUID();
      const tempTodo = {
        id: tempId,
        description,
        deadline: selectedDate?.toISOString(),
        priority,
        receiver,
        status: 'active',
        created_at: new Date().toISOString(),
        user_id: '' // wird vom Server gesetzt
      };
      
      setLocalTodos(prev => [tempTodo, ...prev]);

      // Formular zurücksetzen
      setDescription("");
      setSelectedDate(undefined);
      setPriority("");
      setReceiver("");

      const newTodo = {
        description,
        deadline: selectedDate?.toISOString(),
        priority: priority || undefined,
        receiver: receiver || undefined,
        status: 'active'
      };

      console.log('Sende an Store:', newTodo); 

      await addTodo(newTodo);

      toast({
        title: "Erfolg",
        description: "Todo wurde erfolgreich erstellt",
      });
    } catch (error: any) {
      console.error('Fehler beim Erstellen des Todos:', error); 
      // Bei Fehler den optimistischen Update rückgängig machen
      setLocalTodos(todos);
      toast({
        title: "Fehler",
        description: "Todo konnte nicht erstellt werden: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      // Optimistisches Update
      setLocalTodos(prev =>
        prev.map(todo =>
          todo.id === id ? { ...todo, ...updates } : todo
        )
      );

      await updateTodo(id, updates);
    } catch (error) {
      // Bei Fehler den optimistischen Update rückgängig machen
      setLocalTodos(todos);
    }
  };

  const handleDeleteTodo = async () => {
    if (todoToDelete !== null) {
      try {
        // Optimistisches Update
        setLocalTodos(prev => 
          prev.filter(todo => todo.id !== todoToDelete)
        );
        setTodoToDelete(null);

        await deleteTodo(todoToDelete);
      } catch (error) {
        // Bei Fehler den optimistischen Update rückgängig machen
        setLocalTodos(todos);
      }
    }
  };

  const handleCompleteTodo = async (id: string) => {
    try {
      // Optimistisches Update
      setLocalTodos(prev =>
        prev.map(todo =>
          todo.id === id ? { ...todo, status: 'completed' } : todo
        )
      );

      await completeTodo(id);
    } catch (error) {
      // Bei Fehler den optimistischen Update rückgängig machen
      setLocalTodos(todos);
    }
  };

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Fehler beim Laden der Todos: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Todos</h1>

      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="grid gap-2">
            <label>Beschreibung</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Beschreibung eingeben"
            />
          </div>
          <div className="grid gap-2">
            <label>Deadline</label>
            <DateTimePicker
              date={selectedDate}
              setDate={setSelectedDate}
            />
          </div>
          <div className="grid gap-2">
            <label>Priorität</label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Priorität auswählen" />
              </SelectTrigger>
              <SelectContent>
                {priorities && priorities.length > 0 ? (
                  priorities.map((p) => (
                    <SelectItem key={p.id} value={p.name || p.id}>
                      {p.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="_no_priority">
                    Keine Prioritäten verfügbar
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label>Empfänger</label>
            <Select value={receiver} onValueChange={setReceiver}>
              <SelectTrigger>
                <SelectValue placeholder="Empfänger auswählen" />
              </SelectTrigger>
              <SelectContent>
                {users && users.length > 0 ? (
                  users.map((user) => (
                    <SelectItem key={user.id} value={user.email || user.id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="_no_users">
                    Keine Benutzer verfügbar
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleAddTodo}>Todo erstellen</Button>
        </div>
      </Card>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Beschreibung</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Priorität</TableHead>
            <TableHead>Empfänger</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {localTodos.map((todo) => (
            <TableRow key={todo.id}>
              <TableCell>
                <Input
                  value={todo.description}
                  onChange={(e) =>
                    handleUpdateTodo(todo.id, { description: e.target.value })
                  }
                />
              </TableCell>
              <TableCell>
                <DateTimePicker
                  date={todo.deadline ? new Date(todo.deadline) : undefined}
                  setDate={(date) =>
                    handleUpdateTodo(todo.id, { deadline: date?.toISOString() })
                  }
                />
              </TableCell>
              <TableCell>
                <Select 
                  value={todo.priority || "_no_priority"} 
                  onValueChange={(value) => handleUpdateTodo(todo.id, { priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Priorität auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities && priorities.length > 0 ? (
                      priorities.map((p) => (
                        <SelectItem key={p.id} value={p.name || p.id}>
                          {p.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="_no_priority">
                        Keine Prioritäten verfügbar
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Select 
                  value={todo.receiver || "_no_users"} 
                  onValueChange={(value) => handleUpdateTodo(todo.id, { receiver: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Empfänger auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {users && users.length > 0 ? (
                      users.map((user) => (
                        <SelectItem key={user.id} value={user.email || user.id}>
                          {user.name} ({user.email})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="_no_users">
                        Keine Benutzer verfügbar
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Select 
                  value={todo.status} 
                  onValueChange={(value) => handleUpdateTodo(todo.id, { status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Offen</SelectItem>
                    <SelectItem value="in_progress">In Bearbeitung</SelectItem>
                    <SelectItem value="completed">Erledigt</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTodoToDelete(todo.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {todoToDelete !== null && (
        <div className="mt-4">
          <p>Sind Sie sicher, dass Sie dieses Todo löschen möchten?</p>
          <Button onClick={handleDeleteTodo}>Löschen</Button>
          <Button onClick={() => setTodoToDelete(null)}>Abbrechen</Button>
        </div>
      )}
    </div>
  );
}