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
      await addPriority({
        name: newPriorityName,
        email_notification: false,
        sms_notification: false,
        whatsapp_notification: false,
      });
      setNewPriorityName("");
    } catch (error) {
      // Fehler wird bereits im Store behandelt
    }
  };

  const handleDelete = async () => {
    if (priorityToDelete !== null) {
      try {
        await deletePriority(priorityToDelete);
        setPriorityToDelete(null);
      } catch (error) {
        // Fehler wird bereits im Store behandelt
      }
    }
  };

  const handleUpdatePriority = async (id: string, updates: Partial<Priority>) => {
    try {
      await updatePriority(id, updates);
    } catch (error) {
      // Fehler wird bereits im Store behandelt
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
        <Button onClick={handleAddPriority}>Hinzufügen</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>name</TableHead>
            <TableHead>email_notification</TableHead>
            <TableHead>sms_notification</TableHead>
            <TableHead>whatsapp_notification</TableHead>
            <TableHead>aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {priorities.map((priority) => (
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
                      <AlertDialogTitle>Priorität löschen</AlertDialogTitle>
                      <AlertDialogDescription>
                        Sind Sie sicher, dass Sie diese Priorität löschen möchten?
                        Diese Aktion kann nicht rückgängig gemacht werden.
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
