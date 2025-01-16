"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implementiere API-Aufruf für Passwort-Reset
      // Hier würde der API-Aufruf kommen
      
      toast({
        title: "E-Mail gesendet",
        description: "Bitte überprüfen Sie Ihren Posteingang für weitere Anweisungen.",
      });
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Es gab ein Problem beim Senden der E-Mail. Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-[400px]">
        <CardHeader>
          <CardTitle>Passwort vergessen?</CardTitle>
          <CardDescription>
            Geben Sie Ihre E-Mail-Adresse ein. Wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@beispiel.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Wird gesendet..." : "Link senden"}
            </Button>
            <div className="text-center">
              <a
                href="/login"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Zurück zum Login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
