# Datenbankstruktur

## Tabellen

### contacts
Speichert die Kontakte/Benutzer der Anwendung.

| Spalte      | Typ      | Beschreibung                    |
|-------------|----------|--------------------------------|
| id          | uuid     | Primärschlüssel                |
| name        | text     | Name des Kontakts              |
| email       | text     | E-Mail-Adresse                 |
| phone       | text     | Telefonnummer (optional)       |
| created_at  | timestamptz | Erstellungszeitpunkt        |

### todos
Speichert die Todo-Einträge.

| Spalte      | Typ      | Beschreibung                    |
|-------------|----------|--------------------------------|
| id          | uuid     | Primärschlüssel                |
| description | text     | Beschreibung des Todos         |
| deadline    | timestamptz | Fälligkeitsdatum und -zeit    |
| priority    | text     | Priorität des Todos            |
| receiver    | text     | E-Mail des Empfängers          |
| status      | text     | Status (active/inactive)       |
| created_at  | timestamptz | Erstellungszeitpunkt        |
| user_id     | uuid     | Referenz zum Ersteller         |

### priorities
Speichert die verfügbaren Prioritäten.

| Spalte      | Typ      | Beschreibung                    |
|-------------|----------|--------------------------------|
| id          | uuid     | Primärschlüssel                |
| name        | text     | Name der Priorität             |
| email_notification | boolean | E-Mail-Benachrichtigung    |
| sms_notification | boolean | SMS-Benachrichtigung        |
| whatsapp_notification | boolean | WhatsApp-Benachrichtigung |
| user_id     | uuid     | Referenz zum Ersteller         |
| created_at  | timestamptz | Erstellungszeitpunkt        |

### settings
Speichert die Einstellungen der Benutzer.

| Spalte      | Typ      | Beschreibung                    |
|-------------|----------|--------------------------------|
| id          | uuid     | Primärschlüssel                |
| user_id     | uuid     | Referenz zum Benutzer          |
| sender_email | text     | Absender-E-Mail-Adresse        |
| email_template | text     | E-Mail-Vorlage               |
| created_at  | timestamptz | Erstellungszeitpunkt        |
| updated_at  | timestamptz | Aktualisierungszeitpunkt    |

## Row Level Security (RLS)

### contacts
```sql
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Öffentlicher Lesezugriff für alle authentifizierten Benutzer"
ON public.contacts
FOR SELECT
TO authenticated
USING (true);
```

### todos
```sql
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Benutzer können nur eigene Todos sehen"
ON public.todos
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Benutzer können eigene Todos erstellen"
ON public.todos
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Benutzer können eigene Todos aktualisieren"
ON public.todos
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Benutzer können eigene Todos löschen"
ON public.todos
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
```

### priorities
```sql
ALTER TABLE public.priorities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Benutzer können ihre eigenen Prioritäten sehen"
ON public.priorities
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Benutzer können Prioritäten erstellen"
ON public.priorities
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Benutzer können ihre eigenen Prioritäten aktualisieren"
ON public.priorities
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Benutzer können ihre eigenen Prioritäten löschen"
ON public.priorities
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
```

### settings
```sql
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Benutzer können nur ihre eigenen Einstellungen sehen"
ON public.settings
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Benutzer können ihre Einstellungen erstellen"
ON public.settings
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Benutzer können ihre eigenen Einstellungen aktualisieren"
ON public.settings
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Benutzer können ihre eigenen Einstellungen löschen"
ON public.settings
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
```

## Beziehungen

- `todos.user_id` -> `auth.users(id)`: Jedes Todo gehört zu einem Benutzer
- `priorities.user_id` -> `auth.users(id)`: Jede Priorität gehört zu einem Benutzer
- `todos.priority` -> Referenz auf `priorities.name`
- `todos.receiver` -> Referenz auf `contacts.email`
- `settings.user_id` -> `auth.users(id)`: Jede Einstellung gehört zu einem Benutzer

## Funktionen der Tabellen

### contacts
- Speichert Kontaktinformationen von Benutzern
- Wird für die Empfängerauswahl bei Todos verwendet
- Ermöglicht die Verwaltung von Kontakten im System

### todos
- Zentrale Tabelle für Todo-Einträge
- Verknüpft Todos mit Empfängern und Prioritäten
- Trackt den Status und Deadline von Aufgaben
- Jedes Todo ist einem Benutzer zugeordnet

### priorities
- Definiert verfügbare Prioritätsstufen
- Stellt konsistente Prioritätswerte sicher
- Ermöglicht einfache Erweiterung der Prioritäten

### settings
- Speichert die Einstellungen der Benutzer
- Ermöglicht die Anpassung von Einstellungen pro Benutzer

## Indices

```sql
-- Indices für schnellere Suche
CREATE INDEX IF NOT EXISTS todos_receiver_idx 
    ON public.todos(receiver);
CREATE INDEX IF NOT EXISTS todos_user_id_idx 
    ON public.todos(user_id);
CREATE INDEX IF NOT EXISTS contacts_email_idx 
    ON public.contacts(email);
CREATE INDEX IF NOT EXISTS priorities_name_idx 
    ON public.priorities(name);
CREATE INDEX IF NOT EXISTS priorities_user_id_idx 
    ON public.priorities(user_id);
CREATE INDEX IF NOT EXISTS settings_user_id_idx 
    ON public.settings(user_id);
```

## Validierungen

### contacts
- `id`: Automatisch generierte UUID
- `name`: Darf nicht leer sein
- `email`: Muss eine gültige E-Mail-Adresse sein
- `phone`: Optional
- `created_at`: Wird automatisch auf den aktuellen Zeitpunkt gesetzt

### todos
- `id`: Automatisch generierte UUID
- `description`: Darf nicht leer sein
- `deadline`: Muss ein gültiges Datum sein
- `priority`: Muss einen der definierten Prioritäten haben
- `receiver`: Muss eine gültige E-Mail-Adresse sein
- `status`: Muss entweder 'active' oder 'inactive' sein
- `created_at`: Wird automatisch auf den aktuellen Zeitpunkt gesetzt
- `user_id`: Muss eine gültige UUID eines authentifizierten Benutzers sein

### priorities
- `id`: Automatisch generierte UUID
- `name`: Darf nicht leer sein
- `email_notification`: Optional
- `sms_notification`: Optional
- `whatsapp_notification`: Optional
- `user_id`: Muss eine gültige UUID eines authentifizierten Benutzers sein
- `created_at`: Wird automatisch auf den aktuellen Zeitpunkt gesetzt

### settings
- `id`: Automatisch generierte UUID
- `user_id`: Muss eine gültige UUID eines authentifizierten Benutzers sein
- `sender_email`: Optional
- `email_template`: Optional
- `created_at`: Wird automatisch auf den aktuellen Zeitpunkt gesetzt
- `updated_at`: Wird automatisch auf den aktuellen Zeitpunkt gesetzt

## Beispiel-Queries

### Alle Todos eines Benutzers mit Empfängernamen abrufen
```sql
SELECT t.*, c.name as contact_name, c.email as contact_email
FROM public.todos t
LEFT JOIN public.contacts c ON t.receiver = c.email
WHERE t.user_id = auth.uid()
ORDER BY t.deadline ASC;
```

### Todo erstellen
```sql
INSERT INTO public.todos (description, deadline, priority, receiver, status, user_id)
VALUES (
    'Meeting vorbereiten',
    '2025-01-20 10:00:00+01',
    'hoch',
    'max@example.com',
    'active',
    auth.uid()
)
RETURNING *;
```

## Tabellenstruktur

### contacts
```sql
CREATE TABLE contacts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    email text,
    phone text,
    created_at timestamptz DEFAULT now()
);

-- Index für bessere Performance
CREATE INDEX contacts_name_idx ON contacts(name);
```

### todos
```sql
CREATE TABLE todos (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    description text NOT NULL,
    deadline timestamptz,
    priority text,
    receiver text,
    status text DEFAULT 'active',
    created_at timestamptz DEFAULT now(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Index für bessere Performance
CREATE INDEX todos_user_id_idx ON todos(user_id);
```

### priorities
```sql
CREATE TABLE priorities (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    email_notification boolean DEFAULT false,
    sms_notification boolean DEFAULT false,
    whatsapp_notification boolean DEFAULT false,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now()
);

-- Index für bessere Performance
CREATE INDEX priorities_name_idx ON priorities(name);
CREATE INDEX priorities_user_id_idx ON priorities(user_id);
```

### settings
```sql
CREATE TABLE settings (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    sender_email text,
    email_template text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz
);

-- Index für bessere Performance
CREATE INDEX settings_user_id_idx ON settings(user_id);
```

## Beziehungen

1. `todos.user_id` -> `auth.users(id)`: Jedes Todo gehört zu einem Benutzer
2. `priorities.user_id` -> `auth.users(id)`: Jede Priorität gehört zu einem Benutzer
3. `todos.priority` -> Referenz auf `priorities.name`
4. `todos.receiver` -> Referenz auf `contacts.email`
5. `settings.user_id` -> `auth.users(id)`: Jede Einstellung gehört zu einem Benutzer

## Sicherheit

### Row Level Security (RLS)
- Aktiviert für alle Tabellen
- Benutzer können nur ihre eigenen Todos und Prioritäten sehen und verwalten
- Kontakte sind für alle authentifizierten Benutzer lesbar
- Einstellungen sind nur für den jeweiligen Benutzer sichtbar

### Authentifizierung
- Verwendet Supabase Auth
- Benutzer müssen eingeloggt sein, um auf die Daten zuzugreifen
- `auth.uid()` wird für Benutzeridentifikation verwendet

## Indizes
- `todos_user_id_idx`: Optimiert Abfragen nach Benutzer-Todos
- `priorities_user_id_idx`: Optimiert Abfragen nach Benutzer-Prioritäten
- `contacts_name_idx`: Optimiert Suche nach Kontaktnamen
- `priorities_name_idx`: Optimiert Suche nach Prioritätsnamen
- `settings_user_id_idx`: Optimiert Suche nach Benutzer-Einstellungen

## Best Practices

### Datenintegrität
1. Verwende UUIDs für Primärschlüssel
2. Setze `ON DELETE CASCADE` für Fremdschlüssel
3. Verwende Timestamps für Audit-Trails
4. Benutzer-Isolation durch `user_id`

### Performance
1. Indizes auf häufig abgefragte Spalten
2. Optimierte RLS-Policies
3. Korrekte Datentypen (uuid, text, timestamptz, boolean)

### Sicherheit
1. RLS für Datenisolierung
2. Keine direkten Datenbankzugriffe
3. Authentifizierung über Supabase Auth
