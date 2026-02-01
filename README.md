# Direkte Demokratie – Web-Anwendung

Eine moderne Web-Anwendung für direkte Abstimmungen über Gesetzesänderungen und Gesetzentwürfe.

## Features

- **Vote Feed**: Zentrale Übersicht aller aktiven Abstimmungen als Vote Cards
- **Direkte Abstimmung**: PRO / CONTRA / ENTHALTUNG direkt auf den Cards
- **Echtzeit-Ergebnisse**: Prozentuale Verteilung, Mehrheitsindikator, Quorum-Fortschritt
- **Kommentare**: Diskussion und Austausch zu jedem Gesetzentwurf
- **Composer**: Eigene Gesetzentwürfe einreichen
- **DIP Oracle**: Automatischer Import von Gesetzentwürfen aus der offiziellen DIP Bundestag API
- **Detailseiten**: Vollständiger Gesetzestext mit Markdown-Rendering
- **Barrierearm**: WCAG-konform mit Fokuszuständen, ARIA und Tastaturnavigation

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS (Bundestags-Farbschema)
- **Animationen**: Framer Motion (dezente Micro-Animations)
- **State/Networking**: TanStack Query (React Query)
- **Routing**: React Router
- **Forms**: react-hook-form + zod
- **Icons**: lucide-react
- **Markdown**: react-markdown

## Installation & Start

```bash
# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev

# Build für Produktion
npm run build
```

Die App läuft unter `http://localhost:5173`

## DIP Bundestag Integration (Optional)

Die App kann Gesetzentwürfe automatisch aus der offiziellen DIP API des Bundestags beziehen.

### Ohne API-Key (Empfohlen für lokale Entwicklung)

Die App funktioniert ohne API-Key mit:
- Mock-Daten (Seed-Daten)
- Vite Dev Proxy für lokale Entwicklung

### Mit API-Key

1. DIP API-Key beantragen: [DIP Bundestag](https://dip.bundestag.de)
2. `.env` Datei erstellen (siehe `.env.example`)
3. API-Key eintragen:

```env
VITE_DIP_API_KEY=your-api-key-here
```

### Dev Proxy

Für lokale Entwicklung ist ein Vite Proxy konfiguriert (`vite.config.ts`):

- `/dip/*` → `https://search.dip.bundestag.de/api/v1/*`
- Leitet Authorization Header durch
- Vermeidet CORS-Probleme im Development

## Datenmodell

### Measures (Gesetzentwürfe)

```typescript
{
  id: string
  title: string
  summary: string
  bodyMarkdown: string
  category: string
  status: 'draft' | 'active' | 'resolved'
  totals: { pro: number, contra: number, abstain: number }
  sources: Array<{ label: string, url: string }>
  origin: 'dip' | 'user'
  oracle?: { provider: 'dip-bundestag', ... }
}
```

### Votes

```typescript
{
  id: string
  measureId: string
  userId: string
  choice: 'pro' | 'contra' | 'abstain'
  createdAt: string
}
```

### Comments

```typescript
{
  id: string
  measureId: string
  userId: string
  userDisplayName: string
  body: string
  createdAt: string
}
```

## Architektur

### Mock Backend (MVP)

Aktuell nutzt die App ein Mock-Backend:

- **Storage**: localStorage
- **User**: Zufällige User-ID, persistent im Browser
- **Votes & Comments**: Lokal gespeichert
- **Seed-Daten**: 3 Demo-Gesetzentwürfe

### Service Layer

Klare Trennung:

```
UI Components
    ↓
React Query Hooks
    ↓
Service Layer (src/mock/api.ts)
    ↓
localStorage / DIP API
```

### Ordnerstruktur

```
src/
├── components/
│   ├── ui/              # Design System Komponenten
│   ├── VoteCard.tsx     # Haupt-Vote-Card
│   ├── Composer.tsx     # Gesetzentwurf einreichen
│   ├── CommentSection.tsx
│   └── AppShell.tsx
├── pages/
│   ├── Dashboard.tsx    # Hauptseite mit Feed
│   ├── MeasureDetail.tsx
│   └── About.tsx
├── hooks/               # React Query Hooks
├── mock/                # Mock Backend & User
├── oracle/              # DIP API Integration
└── types/               # TypeScript Typen
```

## Design-System

### Farbschema (Bundestags-Stil)

- **Primär**: Bundestags-Violett `#5F316E`
- **Grau**: Dominant, ruhig, offiziell
- **Success**: Dunkelgrün `#005C45` (PRO)
- **Danger**: Dunkelrot `#780F2D` (CONTRA)
- **Neutral**: Grau (ENTHALTUNG)

### Barrierefreiheit

- Mindestkontrast 4.5:1 (WCAG AA)
- Keine Information nur über Farbe
- Fokuszustände sichtbar
- Tastaturnavigation vollständig
- ARIA-Labels und Semantik

## Erweiterungen für Produktion

### Blockchain Integration

Die Architektur ist vorbereitet für:

- **On-chain Voting**: Smart Contracts für unveränderliche Abstimmungen
- **Wallet Connect**: Web3-Identität statt Mock-User
- **Oracle Resolution**: Chainlink oder optimistische Oracles
- **Governance**: DAO-basierte Moderation von Bürgerentwürfen

### Zu ergänzen

```typescript
// src/blockchain/client.ts
export function useWallet() {
  // Wallet Connect Integration
}

// src/blockchain/contracts.ts
export function useCastVoteTx() {
  // Smart Contract Interaction
}
```

## Lizenz

MIT

## Credits

- DIP API: [Deutscher Bundestag](https://dip.bundestag.de)
- Design: Angelehnt an Digitale Dachmarke Bundesregierung
# DEMOCRAT-FRONTEND
