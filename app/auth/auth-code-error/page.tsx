"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function AuthError() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Authentifizierungsfehler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Bei der Authentifizierung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support.
          </p>
          <div className="flex justify-center space-x-4">
            <Button onClick={() => router.push("/login")}>
              Zum Login
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push("/register")}
            >
              Zur Registrierung
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
