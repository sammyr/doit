"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: 'error' | 'success' | null;
    message: string | null;
  }>({ type: null, message: null });
  
  const { signUp } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: null });

    try {
      const result = await signUp(email, password, name);
      if (result.success) {
        setStatus({
          type: 'success',
          message: 'Registrierung erfolgreich! Bitte überprüfen Sie Ihre E-Mails für den Bestätigungslink.'
        });
        // Warte 3 Sekunden bevor zur Login-Seite weitergeleitet wird
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setStatus({
          type: 'error',
          message: result.message
        });
      }
    } catch (error: any) {
      setStatus({
        type: 'error',
        message: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Registrierung</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {status.type && (
              <Alert variant={status.type === 'error' ? 'destructive' : 'default'}>
                {status.type === 'error' ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                )}
                <AlertTitle>
                  {status.type === 'error' ? 'Fehler' : 'Erfolg'}
                </AlertTitle>
                <AlertDescription>
                  {status.message}
                </AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading || status.type === 'success'}
            >
              {loading ? "Wird registriert..." : "Registrieren"}
            </Button>
            <div className="text-center text-sm">
              <a 
                href="/login" 
                className="text-primary hover:underline"
              >
                Bereits ein Konto? Hier einloggen
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
