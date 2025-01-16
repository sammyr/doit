'use client';

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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { usePriorityStore, Priority } from "@/store/priorities";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";

// Hilfsfunktion für die Generierung einer UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default function PrioritiesPage() {
  const { 
    priorities, 
    loading, 
    error,
    fetchPriorities, 
    addPriority, 
    updatePriority, 
    deletePriority 
  } = usePriorityStore();
  
  const [newPriorityName, setNewPriorityName] = useState("");
  const [priorityToDelete, setPriorityToDelete] = useState<string | null>(null);
  const [localPriorities, setLocalPriorities] = useState<Priority[]>([]);

  useEffect(() => {
    setLocalPriorities(priorities);
  }, [priorities]);

  useEffect(() => {
    fetchPriorities();
  }, [fetchPriorities]);

  const handleAddPriority = async () => {
    if (!newPriorityName.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie einen Namen für die Priorität ein",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Starte Priorität-Erstellung mit:', newPriorityName);

      const tempId = generateUUID();
      const newPriority = {
        id: tempId,
        name: newPriorityName,
        email_notification: false,
        sms_notification: false,
        whatsapp_notification: false,
        created_at: new Date().toISOString(),
        user_id: '' // wird vom Server gesetzt
      };
      
      // Optimistisches Update
      setLocalPriorities(prev => [...prev, newPriority]);
      setNewPriorityName("");

      console.log('Sende an Store:', {
        name: newPriorityName,
        email_notification: false,
        sms_notification: false,
        whatsapp_notification: false,
      });

      await addPriority({
        name: newPriorityName,
        email_notification: false,
        sms_notification: false,
        whatsapp_notification: false,
      });

      toast({
        title: "Erfolg",
        description: "Priorität wurde erfolgreich erstellt",
      });
    } catch (error: any) {
      console.error('Fehler beim Erstellen der Priorität:', error);
      setLocalPriorities(priorities);
      toast({
        title: "Fehler",
        description: "Priorität konnte nicht erstellt werden: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (priorityToDelete !== null) {
      try {
        setLocalPriorities(prev => 
          prev.filter(p => p.id !== priorityToDelete)
        );
        setPriorityToDelete(null);

        await deletePriority(priorityToDelete);
        
        toast({
          title: "Erfolg",
          description: "Priorität wurde erfolgreich gelöscht",
        });
      } catch (error: any) {
        console.error('Fehler beim Löschen der Priorität:', error);
        setLocalPriorities(priorities);
        toast({
          title: "Fehler",
          description: "Priorität konnte nicht gelöscht werden: " + error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleUpdatePriority = async (id: string, updates: Partial<Priority>) => {
    try {
      console.log('Aktualisiere Priorität:', { id, updates });

      setLocalPriorities(prev =>
        prev.map(priority =>
          priority.id === id ? { ...priority, ...updates } : priority
        )
      );

      await updatePriority(id, updates);

      toast({
        title: "Erfolg",
        description: "Priorität wurde erfolgreich aktualisiert",
      });
    } catch (error: any) {
      console.error('Fehler beim Aktualisieren der Priorität:', error);
      setLocalPriorities(priorities);
      toast({
        title: "Fehler",
        description: "Priorität konnte nicht aktualisiert werden: " + error.message,
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
        Fehler beim Laden der Prioritäten: {error}
      </div>
    );
  }

  return (
    <div className="max-w-[2000px] mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6">Prioritäten verwalten</h1>
      
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Neue Priorität"
          value={newPriorityName}
          onChange={(e) => setNewPriorityName(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={handleAddPriority} disabled={loading}>Hinzufügen</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>E-Mail Benachrichtigung</TableHead>
            <TableHead>SMS Benachrichtigung</TableHead>
            <TableHead>WhatsApp Benachrichtigung</TableHead>
            <TableHead>Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {localPriorities.map((priority) => (
            <TableRow key={priority.id}>
              <TableCell>
                <Input
                  value={priority.name}
                  onChange={(e) =>
                    handleUpdatePriority(priority.id, { name: e.target.value })
                  }
                />
              </TableCell>
              <TableCell>
                <Checkbox
                  checked={priority.email_notification}
                  onCheckedChange={(checked) =>
                    handleUpdatePriority(priority.id, {
                      email_notification: checked as boolean,
                    })
                  }
                />
              </TableCell>
              <TableCell>
                <Checkbox
                  checked={priority.sms_notification}
                  onCheckedChange={(checked) =>
                    handleUpdatePriority(priority.id, {
                      sms_notification: checked as boolean,
                    })
                  }
                />
              </TableCell>
              <TableCell>
                <Checkbox
                  checked={priority.whatsapp_notification}
                  onCheckedChange={(checked) =>
                    handleUpdatePriority(priority.id, {
                      whatsapp_notification: checked as boolean,
                    })
                  }
                />
              </TableCell>
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setPriorityToDelete(priority.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Diese Aktion kann nicht rückgängig gemacht werden.
                        Die Priorität wird dauerhaft gelöscht.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setPriorityToDelete(null)}>
                        Abbrechen
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>
                        Löschen
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
