"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useContactStore } from "@/store/contacts";
import { toast } from "@/components/ui/use-toast";

export default function ContactsPage() {
  const { contacts, loading, error, fetchContacts, addContact } = useContactStore();
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleAddContact = async () => {
    if (!newContact.name || !newContact.email || !newContact.phone) {
      toast({
        title: "Fehler",
        description: "Bitte fülle alle Felder aus",
        variant: "destructive",
      });
      return;
    }

    try {
      await addContact(newContact);
      setNewContact({ name: "", email: "", phone: "" });
      setIsOpen(false);
    } catch (error: any) {
      console.error("Fehler beim Erstellen des Kontakts:", error);
      toast({
        title: "Fehler",
        description: error.message || "Kontakt konnte nicht erstellt werden",
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
        Fehler beim Laden der Kontakte: {error}
      </div>
    );
  }

  return (
    <div className="max-w-[2000px] mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Kontakte</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Kontakt hinzufügen
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Neuen Kontakt hinzufügen</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input 
                placeholder="Name" 
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              />
              <Input 
                placeholder="E-Mail" 
                type="email" 
                value={newContact.email}
                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
              />
              <Input 
                placeholder="Telefon" 
                type="tel" 
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
              />
              <Button onClick={handleAddContact}>Kontakt speichern</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>E-Mail</TableHead>
            <TableHead>Telefon</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell>{contact.name}</TableCell>
              <TableCell>{contact.email}</TableCell>
              <TableCell>{contact.phone}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}