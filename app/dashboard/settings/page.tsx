"use client";

import { useEffect, useState } from "react";
import { useSettingsStore } from "@/store/settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function SettingsPage() {
  const { settings, loading, error, fetchSettings, updateSettings } = useSettingsStore();
  
  const [senderEmail, setSenderEmail] = useState("");
  const [emailTemplate, setEmailTemplate] = useState("");

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (settings) {
      setSenderEmail(settings.sender_email || "");
      setEmailTemplate(settings.email_template || "");
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings({
        sender_email: senderEmail,
        email_template: emailTemplate
      });
    } catch (error) {
      console.error('Fehler beim Speichern der Einstellungen:', error);
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
        Fehler beim Laden der Einstellungen: {error}
        <Button 
          onClick={() => fetchSettings()} 
          className="ml-4"
        >
          Erneut versuchen
        </Button>
      </div>
    );
  }

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
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
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
                  value={emailTemplate}
                  onChange={(e) => setEmailTemplate(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Wird gespeichert..." : "Einstellungen speichern"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}