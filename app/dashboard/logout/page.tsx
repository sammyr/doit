"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export default function LogoutPage() {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const logout = async () => {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        // Zeige Erfolgsmeldung
        toast({
          title: "Erfolgreich abgemeldet",
          description: "Sie wurden erfolgreich ausgeloggt.",
        });

        // Weiterleitung zur Login-Seite
        router.push("/login");
      } catch (error: any) {
        console.error("Fehler beim Ausloggen:", error);
        toast({
          title: "Fehler beim Abmelden",
          description: error.message || "Ein unerwarteter Fehler ist aufgetreten",
          variant: "destructive",
        });
      }
    };

    logout();
  }, [router, toast]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Abmelden...</h1>
        <p>Sie werden abgemeldet und weitergeleitet.</p>
      </div>
    </div>
  );
}
