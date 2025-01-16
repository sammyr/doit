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
