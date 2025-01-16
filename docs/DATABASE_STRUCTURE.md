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
| created_at  | timestamptz | Erstellungszeitpunkt        |

## Row Level Security (RLS)

### contacts
```sql
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Öffentlicher Lesezugriff für Kontakte"
ON public.contacts FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authentifizierte Benutzer können Kontakte erstellen"
ON public.contacts FOR INSERT
TO authenticated
WITH CHECK (true);
```

### todos
```sql
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Benutzer können nur eigene Todos sehen"
ON public.todos
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Benutzer können eigene Todos erstellen"
ON public.todos
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Benutzer können eigene Todos aktualisieren"
ON public.todos
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Benutzer können eigene Todos löschen"
ON public.todos
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
```

### priorities
```sql
ALTER TABLE public.priorities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Öffentlicher Lesezugriff für Prioritäten"
ON public.priorities FOR SELECT
TO authenticated
USING (true);
```

## Beziehungen

- `todos.receiver` referenziert `contacts.email`
- `todos.priority` referenziert `priorities.name`
- `todos.user_id` referenziert `auth.users.id`

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
- `created_at`: Wird automatisch auf den aktuellen Zeitpunkt gesetzt

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
    created_at timestamptz DEFAULT now()
);

-- Index für bessere Performance
CREATE INDEX priorities_name_idx ON priorities(name);
```

## Beziehungen

1. `todos.user_id` -> `auth.users(id)`: Jedes Todo gehört zu einem Benutzer
2. `todos.priority` -> Referenz auf `priorities.name`
3. `todos.receiver` -> Referenz auf `contacts.email`

## Sicherheit

### Row Level Security (RLS)
- Aktiviert für alle Tabellen
- Benutzer können nur ihre eigenen Todos sehen und verwalten
- Kontakte und Prioritäten sind für alle authentifizierten Benutzer lesbar

### Authentifizierung
- Verwendet Supabase Auth
- Benutzer müssen eingeloggt sein, um auf die Daten zuzugreifen
- `auth.uid()` wird für Benutzeridentifikation verwendet

## Indizes
- `todos_user_id_idx`: Optimiert Abfragen nach Benutzer-Todos
- `contacts_name_idx`: Optimiert Suche nach Kontaktnamen
- `priorities_name_idx`: Optimiert Suche nach Prioritätsnamen

## Best Practices

### Datenintegrität
1. Verwende UUIDs für Primärschlüssel
2. Setze `ON DELETE CASCADE` für Fremdschlüssel
3. Verwende Timestamps für Audit-Trails

### Performance
1. Indizes auf häufig abgefragte Spalten
2. Optimierte RLS-Policies
3. Korrekte Datentypen (uuid, text, timestamptz)

### Sicherheit
1. RLS für Datenisolierung
2. Keine direkten Datenbankzugriffe
3. Authentifizierung über Supabase Auth
