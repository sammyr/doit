# Fehlerbehebung und Best Practices

## Häufige Fehler und Lösungen

### 1. Fremdschlüsselfehler bei Todos

#### Problem
```
Error: insert or update on table "todos" violates foreign key constraint "todos_user_id_fkey"
```

#### Ursache
- Falsche Datentypen (user_id nicht als UUID)
- Fehlende oder falsche Fremdschlüsselbeziehung
- Bestehende RLS-Policies blockieren Änderungen

#### Lösung
1. Tabelle neu erstellen mit korrekten Datentypen:
```sql
CREATE TABLE todos_new (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    description text NOT NULL,
    deadline timestamptz,
    priority text,
    receiver text,
    status text DEFAULT 'active',
    created_at timestamptz DEFAULT now(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);
```

2. Daten migrieren:
```sql
INSERT INTO todos_new (id, description, deadline, priority, receiver, status, created_at)
SELECT id, description, deadline, priority, receiver, status, created_at
FROM todos;
```

3. Tabellen tauschen:
```sql
DROP TABLE todos;
ALTER TABLE todos_new RENAME TO todos;
```

### 2. Netzwerkfehler bei Supabase-Anfragen

#### Problem
```
TypeError: NetworkError when attempting to fetch resource.
```

#### Ursache
- Komplexe Retry-Logik im Supabase-Client
- Überflüssige Fetch-Konfigurationen
- Zu viele gleichzeitige Anfragen

#### Lösung
1. Vereinfachte Supabase-Client Konfiguration:
```typescript
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    },
    global: {
      headers: {
        'X-Client-Info': 'justdoit-app'
      }
    },
    db: {
      schema: 'public'
    }
  }
);
```

### 3. RLS-Policy Fehler

#### Problem
```
Error: new row violates row-level security policy
```

#### Ursache
- Falsche oder fehlende RLS-Policies
- Benutzer nicht korrekt authentifiziert
- Fehlende Berechtigungen

#### Lösung
1. Korrekte RLS-Policies setzen:
```sql
-- Lesen
CREATE POLICY "Benutzer können nur eigene Todos sehen"
ON todos FOR SELECT TO authenticated
USING (auth.uid() = user_id OR user_id IS NULL);

-- Erstellen
CREATE POLICY "Benutzer können eigene Todos erstellen"
ON todos FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Aktualisieren
CREATE POLICY "Benutzer können eigene Todos aktualisieren"
ON todos FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Löschen
CREATE POLICY "Benutzer können eigene Todos löschen"
ON todos FOR DELETE TO authenticated
USING (auth.uid() = user_id);
```

## Best Practices

### 1. Datenbank-Operationen
- Immer Fremdschlüsselbeziehungen prüfen
- Korrekte Datentypen verwenden (besonders für IDs)
- Indizes für häufig abgefragte Spalten erstellen

### 2. Supabase-Client
- Einfache Client-Konfiguration verwenden
- Authentifizierung über Supabase Auth
- Fehlerbehandlung in den Stores implementieren

### 3. RLS-Policies
- Policies vor Tabellenänderungen entfernen
- Nach Änderungen neu erstellen
- Berechtigungen schrittweise erweitern

### 4. Fehlerbehandlung
- Aussagekräftige Fehlermeldungen
- Toast-Benachrichtigungen für Benutzer
- Logging für Debugging

## Checkliste bei Problemen

1. Datenbankstruktur prüfen
   - Korrekte Datentypen
   - Fremdschlüsselbeziehungen
   - Indizes

2. RLS-Policies überprüfen
   - Korrekte Syntax
   - Berechtigungen
   - Authentifizierung

3. Supabase-Client
   - Umgebungsvariablen
   - Client-Konfiguration
   - Authentifizierungsstatus

4. Store-Implementierung
   - Fehlerbehandlung
   - Authentifizierungsprüfungen
   - Datenbankabfragen
