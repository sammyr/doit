"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
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

export default function TodosPage() {
  const { currentUser } = useUserStore();
  const { priorities, fetchPriorities } = usePriorityStore();
  const { todos, loading, error, fetchTodos, addTodo, updateTodo, deleteTodo } = useTodoStore();
  const { users, fetchUsers } = useUserStore();
  
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [receiver, setReceiver] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();

  useEffect(() => {
    const initializeData = async () => {
      try {
        console.log("Initialisiere Daten...");
        const results = await Promise.all([
          fetchTodos(),
          fetchUsers(),
          fetchPriorities()
        ]);
        console.log("Daten geladen:", {
          users: results[1],
          priorities: results[2]
        });
      } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
        toast({
          title: "Fehler",
          description: "Daten konnten nicht geladen werden",
          variant: "destructive",
        });
      }
    };

    initializeData();
  }, [fetchTodos, fetchUsers, fetchPriorities]);

  const handleAddTodo = async () => {
    if (!description || !selectedDate || !priority || !receiver || 
        priority === "_no_priority" || receiver === "_no_users") {
      toast({
        title: "Fehler",
        description: "Bitte fülle alle Felder korrekt aus",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Erstelle neues Todo:', {
        description,
        deadline: selectedDate.toISOString(),
        priority,
        receiver,
        status: "active"
      });

      await addTodo({
        description,
        deadline: selectedDate.toISOString(),
        priority,
        receiver,
        status: "active",
      });

      resetForm();
      toast({
        title: "Erfolg",
        description: "Todo wurde erstellt",
      });
    } catch (error: any) {
      console.error('Fehler beim Erstellen des Todos:', error);
      toast({
        title: "Fehler",
        description: error.message || "Todo konnte nicht erstellt werden",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setDescription("");
    setSelectedDate(undefined);
    setPriority("");
    setReceiver("");
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Möchtest du dieses Todo wirklich löschen?")) {
      try {
        await deleteTodo(id);
        toast({
          title: "Erfolg",
          description: "Todo wurde gelöscht",
        });
      } catch (error) {
        console.error("Fehler beim Löschen des Todos:", error);
        toast({
          title: "Fehler",
          description: "Todo konnte nicht gelöscht werden",
          variant: "destructive",
        });
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: "active" | "inactive") => {
    try {
      await updateTodo(id, { status: newStatus });
      toast({
        title: "Erfolg",
        description: `Todo wurde als ${newStatus === "active" ? "aktiv" : "inaktiv"} markiert`,
      });
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Status:", error);
      toast({
        title: "Fehler",
        description: "Status konnte nicht aktualisiert werden",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

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
            <TableHead className="w-[50px]">Status</TableHead>
            <TableHead className="w-[300px]">Beschreibung</TableHead>
            <TableHead className="w-[200px]">Deadline</TableHead>
            <TableHead className="w-[150px]">Priorität</TableHead>
            <TableHead className="w-[250px]">Empfänger</TableHead>
            <TableHead className="w-[100px]">Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {todos.map((todo) => (
            <TableRow key={todo.id}>
              <TableCell>
                <Checkbox
                  checked={todo.status === "inactive"}
                  onCheckedChange={(checked) =>
                    handleStatusChange(todo.id, checked ? "inactive" : "active")
                  }
                />
              </TableCell>
              <TableCell>{todo.description}</TableCell>
              <TableCell>{format(new Date(todo.deadline), "dd.MM.yyyy HH:mm", { locale: de })}</TableCell>
              <TableCell>{todo.priority}</TableCell>
              <TableCell>
                {users.find(u => u.email === todo.receiver)?.name || todo.receiver}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(todo.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}