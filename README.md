# TaskMaster Pro

Eine moderne Todo-App mit Supabase-Integration.

## Installation

1. Repository klonen
2. Dependencies installieren:
```bash
npm install
```

3. Umgebungsvariablen einrichten:
   - Kopiere `.env.example` zu `.env`
   - Fülle die folgenden Variablen aus:
     - `NEXT_PUBLIC_SUPABASE_URL`: Deine Supabase Projekt-URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Dein Supabase Anon Key
     - `SUPABASE_SERVICE_ROLE_KEY`: Dein Supabase Service Role Key
     - `DATABASE_URL`: Deine Postgres Datenbank-URL
     - `SUPABASE_DASHBOARD_USER`: Dein Dashboard Benutzername
     - `SUPABASE_DASHBOARD_PASSWORD`: Dein Dashboard Passwort
     - `MINIO_ROOT_USER`: Dein MinIO Benutzername
     - `MINIO_ROOT_PASSWORD`: Dein MinIO Passwort

4. Entwicklungsserver starten:
```bash
npm run dev
```

## Sicherheitshinweise

- Stelle sicher, dass die `.env` Datei NIEMALS in Git eingecheckt wird
- Verwende für die Produktion andere Zugangsdaten als für die Entwicklung
- Halte die Supabase Service Role Key geheim und verwende sie nur auf dem Server
