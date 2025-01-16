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

## Troubleshooting Guide

### 1. Todo-Erstellung funktioniert nicht

#### Problem
- Keine Reaktion beim Klicken auf "Todo erstellen"
- Fehlermeldung in der Konsole
- Optimistisches Update schlägt fehl

#### Lösungen
1. **Validierung der Eingaben**
   - Beschreibung ist ein Pflichtfeld
   - Andere Felder sind optional
   - Prüfen Sie die Konsolenausgabe auf Validierungsfehler

2. **UUID-Generierung**
   ```typescript
   // Verwenden Sie diese Funktion statt crypto.randomUUID()
   function generateUUID() {
     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
       const r = Math.random() * 16 | 0;
       const v = c === 'x' ? r : (r & 0x3 | 0x8);
       return v.toString(16);
     });
   }
   ```

3. **Supabase-Verbindung**
   - Prüfen Sie die Supabase-Credentials in `.env`
   - Stellen Sie sicher, dass RLS-Policies korrekt konfiguriert sind
   - Überprüfen Sie die Netzwerkanfragen im Browser

### 2. Status-Updates funktionieren nicht

#### Problem
- Checkbox-Status ändert sich nicht
- Fehlermeldung beim Statuswechsel
- Inkonsistente Status-Anzeige

#### Lösungen
1. **Status-Werte prüfen**
   ```typescript
   // Gültige Status-Werte
   type TodoStatus = 'active' | 'completed';
   ```

2. **Optimistisches Update**
   ```typescript
   // Korrektes Update mit Rollback
   try {
     setLocalTodos(prev =>
       prev.map(todo =>
         todo.id === id ? { ...todo, status: 'completed' } : todo
       )
     );
     await completeTodo(id);
   } catch (error) {
     setLocalTodos(todos); // Rollback bei Fehler
   }
   ```

### 3. Benutzer-/Prioritätenauswahl funktioniert nicht

#### Problem
- Dropdown-Menüs bleiben leer
- Falsche Werte werden angezeigt
- Auswahl wird nicht gespeichert

#### Lösungen
1. **Daten-Initialisierung**
   ```typescript
   useEffect(() => {
     fetchUsers();
     fetchPriorities();
   }, [fetchUsers, fetchPriorities]);
   ```

2. **Select-Komponente**
   ```typescript
   <Select
     value={priority}
     onValueChange={setPriority}
   >
     <SelectTrigger>
       <SelectValue placeholder="Priorität auswählen" />
     </SelectTrigger>
     <SelectContent>
       {priorities.map((p) => (
         <SelectItem key={p.id} value={p.name}>
           {p.name}
         </SelectItem>
       ))}
     </SelectContent>
   </Select>
   ```

### 4. UI-Aktualisierungen verzögert

#### Problem
- Änderungen werden nicht sofort angezeigt
- UI "springt" nach Aktualisierungen
- Inkonsistente Anzeige

#### Lösungen
1. **Optimistisches Update**
   ```typescript
   // Sofortige UI-Aktualisierung
   setLocalTodos(prev => [newTodo, ...prev]);
   
   // Server-Anfrage
   try {
     await addTodo(newTodo);
   } catch {
     setLocalTodos(todos); // Rollback bei Fehler
   }
   ```

2. **State Management**
   ```typescript
   // Lokalen und globalen State synchron halten
   useEffect(() => {
     setLocalTodos(todos);
   }, [todos]);
   ```

## Debugging-Tipps

### 1. Console Logs
```typescript
console.log('Starte Todo-Erstellung:', {
  description,
  deadline: selectedDate?.toISOString(),
  priority,
  receiver
});
```

### 2. Error Handling
```typescript
catch (error: any) {
  console.error('Fehler:', error);
  toast({
    title: "Fehler",
    description: error.message,
    variant: "destructive",
  });
}
```

### 3. Network Requests
- Browser DevTools -> Network Tab
- Supabase Dashboard -> Database -> Realtime
- API-Endpunkte in den Logs überprüfen

## Best Practices

### 1. Validierung
```typescript
if (!description.trim()) {
  toast({
    title: "Fehler",
    description: "Beschreibung ist erforderlich",
    variant: "destructive",
  });
  return;
}
```

### 2. Typsicherheit
```typescript
interface Todo {
  id: string;
  description: string;
  deadline?: string;
  priority?: string;
  receiver?: string;
  status: 'active' | 'completed';
  user_id: string;
  created_at: string;
}
```

### 3. Error Boundaries
```typescript
<ErrorBoundary fallback={<ErrorComponent />}>
  <TodoList />
</ErrorBoundary>
```

## Support

Bei weiteren Problemen:
1. Überprüfen Sie die Konsolenausgabe
2. Validieren Sie die Eingabedaten
3. Testen Sie die Netzwerkverbindung
4. Prüfen Sie die Supabase-Konfiguration
5. Kontaktieren Sie das Entwicklerteam

## Fehlerbehebung

## Bekannte Probleme und Lösungen

### 1. Datenbank-Probleme

#### Schema-Cache-Fehler
**Problem**: `Could not find the 'email_template' column of 'settings' in the schema cache`
**Lösung**: 
1. Überprüfen Sie, ob die Tabelle und Spalten in der Datenbank existieren
2. Starten Sie den Next.js-Server neu
3. Wenn das Problem weiterhin besteht, führen Sie die SQL-Befehle erneut aus:
```sql
-- Überprüfen der Tabellenstruktur
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'settings';

-- Fehlende Spalten hinzufügen
ALTER TABLE settings 
ADD COLUMN IF NOT EXISTS sender_email TEXT,
ADD COLUMN IF NOT EXISTS email_template TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;
```

#### Datenbank-Verbindungsfehler
**Problem**: `Error: Connection refused`
**Lösung**:
1. Überprüfen Sie die Umgebungsvariablen in `.env`
2. Stellen Sie sicher, dass die Supabase-URL und der API-Key korrekt sind
3. Überprüfen Sie die Netzwerkverbindung

### 2. Authentifizierung

#### Session-Fehler
**Problem**: `Error: Not authenticated`
**Lösung**:
1. Abmelden und erneut anmelden
2. Browser-Cache und Cookies löschen
3. Überprüfen Sie die Auth-Konfiguration in `supabase.ts`

### 3. UI-Probleme

#### Seite lädt nicht
**Problem**: Endlose Ladeanzeige oder weiße Seite
**Lösung**:
1. Browser-Entwicklertools öffnen und nach Fehlern suchen
2. Next.js-Server neu starten
3. `node_modules` löschen und `npm install` ausführen

#### Formular-Reset
**Problem**: Formular wird nicht zurückgesetzt nach dem Speichern
**Lösung**:
```typescript
// Formular nach dem Speichern zurücksetzen
form.reset();
// oder bei kontrollierten Komponenten
setState("");
```

### 4. State Management

#### Zustand wird nicht aktualisiert
**Problem**: Änderungen werden nicht sofort angezeigt
**Lösung**:
1. Überprüfen Sie die `useEffect` Dependencies
2. Stellen Sie sicher, dass der Store korrekt aktualisiert wird
3. Verwenden Sie optimistische Updates

```typescript
// Beispiel für optimistisches Update
const updateTodo = async (id: string, data: Partial<Todo>) => {
  // Optimistisches Update
  set(state => ({
    todos: state.todos.map(todo => 
      todo.id === id ? { ...todo, ...data } : todo
    )
  }));

  try {
    // API-Aufruf
    const result = await supabase
      .from('todos')
      .update(data)
      .eq('id', id)
      .single();

    if (result.error) throw result.error;
  } catch (error) {
    // Rollback bei Fehler
    await fetchTodos();
    toast({
      title: "Fehler",
      description: "Änderung konnte nicht gespeichert werden",
      variant: "destructive"
    });
  }
};
```

## Best Practices

### 1. Fehlerbehandlung
- Immer try-catch Blöcke verwenden
- Benutzerfreundliche Fehlermeldungen anzeigen
- Fehler in der Konsole loggen für Debugging

### 2. Performance
- Vermeiden Sie unnötige Re-Renders
- Verwenden Sie Memoization wo sinnvoll
- Implementieren Sie Pagination für große Datenlisten

### 3. Sicherheit
- Validieren Sie alle Benutzereingaben
- Verwenden Sie Row Level Security (RLS)
- Schützen Sie sensible Daten

### 4. Code-Organisation
- Verwenden Sie TypeScript für bessere Typsicherheit
- Strukturieren Sie den Code in logische Module
- Dokumentieren Sie komplexe Funktionen

## Support

Bei weiteren Problemen:
1. Überprüfen Sie die Logs
2. Konsultieren Sie die [Supabase-Dokumentation](https://supabase.com/docs)
3. Öffnen Sie ein Issue im GitHub-Repository
