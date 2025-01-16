# TaskMaster Pro - Anwendungsstruktur

## 1. Datenmodelle

### User
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}
```

### Todo
```typescript
interface Todo {
  id: number;
  description: string;
  deadline: Date;
  priority: string;
  receiver: string; // Email des Empfängers
  status: "active" | "inactive";
}
```

### Settings
```typescript
interface Settings {
  senderEmail: string;    // Absender E-Mail Adresse für Benachrichtigungen
  emailTemplate: string;  // E-Mail Template für Benachrichtigungen
}
```

## 2. Zustandsverwaltung (Store)

### UserStore
```typescript
interface UserStore {
  users: User[];
  user: User | null;
  addUser: (newUser: Omit<User, "id">) => void;
  setUser: (user: User) => void;
  clearUser: () => void;
}
```

## 3. Seitenstruktur

### /login
- Authentifizierung der Benutzer
- UI-Komponenten:
  - Card: Login-Container
  - Input: email, password
  - Button: "Anmelden"
  - Link: "Passwort vergessen?" (unterhalb des Login-Buttons)
    - Styling: text-sm text-blue-600 hover:text-blue-800
    - Position: mt-4 text-center
- Formularfelder: 
  - email
  - password
- Funktionen:
  - handleSubmit: Benutzeranmeldung
  - handleForgotPassword: Navigation zur /forgot-password Seite
  - Weiterleitung zum Dashboard bei erfolgreicher Anmeldung
- Link zur "Passwort vergessen" Seite

### /forgot-password
- Passwort-Wiederherstellung
- Formularfelder: email
- Funktionen:
  - handleSubmit: Sendet Reset-Link an E-Mail
  - validateEmail: Überprüft E-Mail-Format
- E-Mail-Template-Variablen:
  - {resetLink}: Link zum Zurücksetzen des Passworts
  - {userName}: Name des Benutzers
- Sicherheitsmerkmale:
  - Ratenbegrenzung: Max. 3 Versuche pro Stunde
  - Reset-Link-Gültigkeit: 24 Stunden

### /reset-password
- Neues Passwort setzen
- Formularfelder:
  - newPassword
  - confirmPassword
- Funktionen:
  - validateToken: Überprüft Gültigkeit des Reset-Tokens
  - handleSubmit: Setzt neues Passwort
  - validatePassword: Überprüft Passwortstärke
- Sicherheitsanforderungen:
  - Mindestlänge: 8 Zeichen
  - Muss Zahlen und Sonderzeichen enthalten

### /dashboard
- Geschützter Bereich (nur für angemeldete Benutzer)
- Layout-Komponenten:
  - Sidebar mit Navigation
  - Header mit Benutzermenü

### /dashboard/todos
- Todo-Verwaltung
- Funktionen:
  - handleAddTodo: Neues Todo erstellen
  - handleEditTodo: Todo bearbeiten
  - handleDeleteTodo: Todo löschen
  - handleStatusChange: Status ändern
- Filteroptionen:
  - Nach Priorität
  - Nach Status
  - Nach Empfänger

### /dashboard/account
- Benutzerprofil-Verwaltung
- Sektionen:
  - Profilinformationen (Name, Email, Telefon)
  - Sicherheitseinstellungen (Passwort ändern)

### /dashboard/billing
- Abonnement- und Zahlungsverwaltung
- Komponenten:
  - Aktueller Plan
  - Verfügbare Pläne
  - Zahlungsmethoden

### /dashboard/checkup
- Systemstatus und Performance
- Komponenten:
  - Systemstatus
  - Performance-Metriken
  - Update-Status

### /dashboard/settings
- E-Mail-Einstellungen Verwaltung
- Felder:
  - Absender E-Mail Adresse (senderEmail)
  - E-Mail Template (emailTemplate)
- Funktionen:
  - handleSubmit: Einstellungen speichern
- Template-Variablen:
  - {name}: Name des Empfängers
  - {todo}: Beschreibung der Aufgabe
  - {deadline}: Fälligkeitsdatum

### /dashboard/logout
- Abmeldeseite
- Funktionen:
  - Automatische Abmeldung
  - Weiterleitung zur Login-Seite

## 4. Wichtige Komponenten

### Sidebar
- Navigation zwischen Seiten
- Benutzermenü
- Logout-Funktion

### Layout
- Gemeinsames Layout für Dashboard-Seiten
- Authentifizierungsprüfung
- Maximale Inhaltsbreite: max-w-[2000px]
- Einheitliches Padding: py-6 px-4 sm:px-6 lg:px-8

## 5. Styling und UI

### Globale Styles
- Schriftart: Manrope
- Responsive Design
- Einheitliche Abstände:
  - Padding: py-6 px-4 sm:px-6 lg:px-8
  - Gaps: gap-6
  - Margins: mb-6

### UI-Komponenten (shadcn/ui)
- Button
- Card
- Input
- Select
- Table
- Dialog
- DropdownMenu
- Label
- Separator

## 6. Authentifizierung

### Login-Flow
1. Benutzer gibt Email ein
2. Bei erfolgreicher Anmeldung:
   - User wird im Store gesetzt
   - Weiterleitung zum Dashboard
3. Bei Fehler:
   - Fehlermeldung wird angezeigt

### Geschützte Routen
- Alle `/dashboard/*` Routen sind geschützt
- Weiterleitung zur Login-Seite bei fehlendem Auth-Status

## 7. Wichtige Funktionen zu erhalten

### User Management
- `addUser`: Neuen Benutzer hinzufügen
- `setUser`: Aktuellen Benutzer setzen
- `clearUser`: Benutzer abmelden

### Todo Management
- `handleAddTodo`: Todo erstellen
- `handleEditTodo`: Todo bearbeiten
- `handleDeleteTodo`: Todo löschen
- `handleStatusChange`: Todo-Status ändern
- `resetForm`: Formular zurücksetzen

### Hilfs-Funktionen
- `getUserNameByEmail`: Benutzername anhand der Email finden
- `format`: Datumsformatierung

## 8. Zu beachtende Einschränkungen

1. Keine Entfernung vorhandener Felder oder Funktionen
2. Beibehaltung der Authentifizierungslogik
3. Einheitliche Seitenbreite (max-w-[2000px])
4. Konsistentes Layout und Styling
5. Verwendung der shadcn/ui Komponenten

## 9. Erweiterungspunkte

Die App kann erweitert werden um:
1. Echte Backend-Integration
2. Erweiterte Benutzerrollen
3. Team-Funktionen
4. Dateianhänge für Todos
5. Benachrichtigungssystem
6. Erweiterte Filteroptionen
7. Export/Import Funktionen
8. Aktivitätsprotokoll

Diese Dokumentation dient als Referenz für die Weiterentwicklung der Anwendung und sollte bei Änderungen aktualisiert werden.

## 10. Implementierungsdetails

### Todo-Verwaltung

#### Komponenten-Struktur
- `page.tsx`: Hauptkomponente für die Todo-Verwaltung
- Verwendet Shadcn/UI Komponenten für ein konsistentes Design
- Implementiert optimistisches UI-Update für bessere Benutzererfahrung

#### Features
- Erstellen neuer Todos mit:
  - Beschreibung (Pflichtfeld)
  - Deadline (optional, DateTimePicker)
  - Priorität (optional, Select aus verfügbaren Prioritäten)
  - Empfänger (optional, Select aus verfügbaren Benutzern)
  - Status (aktiv/abgeschlossen)
- Inline-Bearbeitung von Todos
- Löschen von Todos mit Bestätigungsdialog
- Status-Änderung durch Checkbox

#### Implementierungsdetails
```typescript
// Formular-State
const [description, setDescription] = useState("");
const [selectedDate, setSelectedDate] = useState<Date>();
const [priority, setPriority] = useState("");
const [receiver, setReceiver] = useState("");

// Optimistisches Update beim Erstellen
const handleAddTodo = async () => {
  // Validierung
  if (!description.trim()) {
    toast({ title: "Fehler", description: "Beschreibung erforderlich" });
    return;
  }

  // Temporäres Todo für sofortige UI-Aktualisierung
  const tempId = generateUUID();
  const tempTodo = {
    id: tempId,
    description,
    deadline: selectedDate?.toISOString(),
    priority,
    receiver,
    status: 'active',
    created_at: new Date().toISOString(),
    user_id: ''
  };

  // Optimistisches Update
  setLocalTodos(prev => [tempTodo, ...prev]);

  try {
    // Server-Anfrage
    await addTodo({
      description,
      deadline: selectedDate?.toISOString(),
      priority: priority || undefined,
      receiver: receiver || undefined
    });
  } catch (error) {
    // Rollback bei Fehler
    setLocalTodos(todos);
    toast({ title: "Fehler", description: error.message });
  }
};
```

### State Management

#### Todo Store (`store/todos.ts`)
- Verwendet Zustand für globales State Management
- Implementiert CRUD-Operationen mit Supabase
- Handhabt optimistisches UI-Update und Fehlerbehandlung

```typescript
interface TodoStore {
  todos: Todo[];
  error: string | null;
  fetchTodos: () => Promise<void>;
  addTodo: (todo: Omit<Todo, 'id' | 'created_at' | 'user_id' | 'status'>) => Promise<void>;
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  completeTodo: (id: string) => Promise<void>;
}
```

#### Prioritäten Store (`store/priorities.ts`)
- Verwaltet verfügbare Prioritäten
- Ermöglicht CRUD-Operationen für Prioritäten
- Implementiert RLS-Policies für Sicherheit

#### User Store (`store/users.ts`)
- Handhabt Benutzerauthentifizierung
- Verwaltet Benutzerprofile
- Stellt Benutzerinformationen für Todo-Zuweisung bereit

### Datenbank-Struktur

#### Todos Tabelle
```sql
CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  description TEXT NOT NULL,
  deadline TIMESTAMPTZ,
  priority TEXT REFERENCES priorities(id),
  receiver TEXT REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'active',
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### RLS-Policies
```sql
-- Benutzer können nur ihre eigenen Todos sehen
CREATE POLICY "Todos sind privat" ON todos
  FOR SELECT USING (auth.uid() = user_id);

-- Benutzer können nur ihre eigenen Todos bearbeiten
CREATE POLICY "Nur eigene Todos bearbeiten" ON todos
  FOR UPDATE USING (auth.uid() = user_id);
```

## Optimierungen und Best Practices

### 1. Performance
- Optimistisches UI-Update für sofortige Benutzerrückmeldung
- Effiziente State-Updates mit Zustand
- Lazy Loading von Komponenten

### 2. Fehlerbehandlung
- Umfassende Fehlerbehandlung mit Toast-Benachrichtigungen
- Rollback bei fehlgeschlagenen Operationen
- Validierung von Benutzereingaben

### 3. Sicherheit
- RLS-Policies für Datenzugriffskontrolle
- Authentifizierung über Supabase
- Sichere API-Endpoints

### 4. UX/UI
- Konsistentes Design mit Shadcn/UI
- Responsive Layout
- Sofortige Benutzerrückmeldung
- Inline-Bearbeitung für effiziente Workflows

## Entwicklungs-Workflow

### 1. Neue Features
1. Komponente erstellen/anpassen
2. Store-Funktionen implementieren
3. UI-Logik mit optimistischem Update
4. Fehlerbehandlung hinzufügen
5. Tests und Dokumentation

### 2. Debugging
1. Console.log für wichtige Operationen
2. Error Boundaries für React-Fehler
3. Toast-Benachrichtigungen für Benutzer
4. Rollback-Mechanismen für fehlgeschlagene Operationen

## Wartung und Updates

### 1. Code-Organisation
- Klare Komponenten-Struktur
- Wiederverwendbare Hooks und Utilities
- Typsichere Implementierung mit TypeScript

### 2. Dokumentation
- Inline-Kommentare für komplexe Logik
- README für Setup und Entwicklung
- API-Dokumentation für Endpoints

### 3. Testing
- Unit Tests für Store-Funktionen
- Integration Tests für Komponenten
- E2E Tests für kritische Workflows

## Technologie-Stack

- **Frontend**: Next.js 13+ mit App Router
- **Backend**: Supabase (PostgreSQL + Auth)
- **Sprache**: TypeScript
- **State Management**: Zustand
- **UI**: Tailwind CSS + shadcn/ui
- **Formulare**: React Hook Form
- **Validierung**: Zod

## Verzeichnisstruktur

```
JustDoIt/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentifizierung
│   └── dashboard/         # Hauptanwendung
│       ├── priorities/    # Prioritäten-Verwaltung
│       ├── settings/      # Einstellungen
│       └── todos/         # Todo-Verwaltung
├── components/            # UI-Komponenten
│   ├── ui/               # Basis-UI-Komponenten
│   └── shared/           # Gemeinsam genutzte Komponenten
├── lib/                   # Hilfsfunktionen
│   └── supabase.ts       # Supabase-Client
├── store/                # Zustand Stores
│   ├── priorities.ts     # Prioritäten-Store
│   ├── settings.ts       # Einstellungen-Store
│   └── todos.ts          # Todo-Store
└── types/                # TypeScript Typdefinitionen
```

## Datenmodelle

### 1. Todo
```typescript
interface Todo {
  id: string;
  description: string;
  deadline?: Date;
  priority?: string;
  receiver?: string;
  status: 'active' | 'completed';
  user_id: string;
  created_at: string;
}
```

### 2. Priority
```typescript
interface Priority {
  id: string;
  name: string;
  email_notification: boolean;
  sms_notification: boolean;
  whatsapp_notification: boolean;
  user_id: string;
  created_at: string;
}
```

### 3. Settings
```typescript
interface Settings {
  id: string;
  user_id: string;
  sender_email: string | null;
  email_template: string | null;
  created_at: string;
  updated_at: string;
}
```

## Features

### 1. Todo-Management
- Erstellen, Bearbeiten, Löschen von Todos
- Status-Tracking
- Prioritäten-Zuweisung
- Deadline-Management

### 2. Prioritäten
- Benutzerdefinierte Prioritäten
- Benachrichtigungseinstellungen pro Priorität
- Farbkodierung

### 3. Einstellungen
- E-Mail-Absender-Konfiguration
- Anpassbare E-Mail-Templates
- Benutzereinstellungen

### 4. Benachrichtigungen
- E-Mail-Benachrichtigungen
- Status-Updates
- Deadline-Erinnerungen

## Best Practices

### 1. Code-Organisation
- Modulare Komponenten
- Wiederverwendbare Hooks
- Typsichere Interfaces

### 2. State Management
- Zentralisierte Stores
- Optimistische Updates
- Error Handling

### 3. UI/UX
- Responsive Design
- Konsistente Styling
- Benutzerfreundliche Formulare

### 4. Performance
- Lazy Loading
- Memoization
- Effiziente Datenbankabfragen

## Sicherheit

### 1. Authentifizierung
- Supabase Auth Integration
- Geschützte Routen
- Session Management

### 2. Autorisierung
- Row Level Security (RLS)
- Benutzer-spezifische Daten
- Validierung

### 3. Datenschutz
- Sichere API-Aufrufe
- Verschlüsselte Verbindungen
- Datenisolierung

## Wartung

### 1. Logging
- Error Tracking
- Performance Monitoring
- Benutzeraktivitäten

### 2. Updates
- Dependency Management
- Security Patches
- Feature Updates

### 3. Backup
- Datenbank-Backups
- Code-Versionierung
- Wiederherstellungsprozesse
