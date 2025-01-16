"use client";

import { useUserStore } from "@/store/users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function SettingsPage() {
  const { user } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement settings update
  };

  return (
    <div className="max-w-[2000px] mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Einstellungen</h2>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>E-Mail Einstellungen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="senderEmail">Absender E-Mail Adresse</Label>
                <Input 
                  id="senderEmail" 
                  type="email" 
                  placeholder="noreply@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailTemplate">E-Mail Template</Label>
                <Textarea 
                  id="emailTemplate" 
                  placeholder="Sehr geehrte/r {name},

Ihre Aufgabe '{todo}' ist fällig am {deadline}.

Mit freundlichen Grüßen
Ihr TaskMaster Pro Team"
                  className="min-h-[200px]"
                />
              </div>
              <Button type="submit">Einstellungen speichern</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}