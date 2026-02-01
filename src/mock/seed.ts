import { Measure } from '../types';

export const seedMeasures: Measure[] = [
  {
    id: 'seed-1',
    title: 'Entwurf eines Gesetzes zur Förderung erneuerbarer Energien',
    summary: 'Drucksache 20/1234 (WP 20) - Vorschlag zur Erhöhung der Förderquoten für Windkraft und Solarenergie',
    bodyMarkdown: `# Gesetzentwurf: Förderung erneuerbarer Energien

## Zusammenfassung

Dieser Gesetzentwurf sieht vor, die Förderquoten für erneuerbare Energien zu erhöhen und den Ausbau von Windkraft- und Solaranlagen zu beschleunigen.

## Begründung

Die Energiewende erfordert schnelleres Handeln. Mit diesem Gesetz sollen die Rahmenbedingungen für den Ausbau erneuerbarer Energien verbessert werden.

## Auswirkungen

- Erhöhung der Fördersätze um 15%
- Vereinfachte Genehmigungsverfahren
- Ziel: 80% Erneuerbare bis 2030
`,
    category: 'Klima & Energie',
    startAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    endAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    quorum: 500,
    totals: { pro: 342, contra: 128, abstain: 45 },
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    sources: [
      { label: 'DIP Drucksache PDF', url: 'https://dserver.bundestag.de/btd/20/012/2001234.pdf' },
    ],
    origin: 'dip',
    oracle: {
      provider: 'dip-bundestag',
      documentId: 'dip-12345',
      dokumentnummer: '20/1234',
      wahlperiode: 20,
      pdfUrl: 'https://dserver.bundestag.de/btd/20/012/2001234.pdf',
    },
  },
  {
    id: 'seed-2',
    title: 'Digitale Verwaltungsmodernisierung 2026',
    summary: 'Drucksache 20/2345 (WP 20) - Beschleunigung der Digitalisierung öffentlicher Dienstleistungen',
    bodyMarkdown: `# Gesetzentwurf: Digitale Verwaltungsmodernisierung

## Zusammenfassung

Alle Behördengänge sollen bis 2027 digital möglich sein. Bürger erhalten digitale Identitäten und können Verwaltungsleistungen online nutzen.

## Begründung

Deutschland liegt bei der Digitalisierung der Verwaltung zurück. Dieser Entwurf schafft die rechtlichen Grundlagen für eine vollständig digitale Verwaltung.

## Auswirkungen

- Einführung digitaler Identitäten
- Online-Zugang zu allen Verwaltungsleistungen
- Investition von 2 Mrd. € über 3 Jahre
`,
    category: 'Digitales & Verwaltung',
    startAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    endAt: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    quorum: 500,
    totals: { pro: 428, contra: 67, abstain: 31 },
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    sources: [
      { label: 'DIP Drucksache PDF', url: 'https://dserver.bundestag.de/btd/20/023/2002345.pdf' },
    ],
    origin: 'dip',
    oracle: {
      provider: 'dip-bundestag',
      documentId: 'dip-23456',
      dokumentnummer: '20/2345',
      wahlperiode: 20,
      pdfUrl: 'https://dserver.bundestag.de/btd/20/023/2002345.pdf',
    },
  },
  {
    id: 'seed-3',
    title: 'Mobilitätswende: ÖPNV-Ausbau und Ticketreform',
    summary: 'Drucksache 20/3456 (WP 20) - Bundesweites Nahverkehrsticket und Investitionen in Infrastruktur',
    bodyMarkdown: `# Gesetzentwurf: ÖPNV-Ausbau und Ticketreform

## Zusammenfassung

Einführung eines bundesweiten 49-Euro-Tickets und massiver Ausbau des öffentlichen Nahverkehrs.

## Begründung

Um die Klimaziele zu erreichen und Mobilität für alle zu gewährleisten, ist ein attraktiver ÖPNV notwendig.

## Auswirkungen

- Bundesweites 49-Euro-Ticket
- 10 Mrd. € Investitionen in Infrastruktur
- Verdopplung der Taktung in Ballungsräumen
`,
    category: 'Verkehr & Mobilität',
    startAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    endAt: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    quorum: 500,
    totals: { pro: 521, contra: 98, abstain: 52 },
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    sources: [
      { label: 'DIP Drucksache PDF', url: 'https://dserver.bundestag.de/btd/20/034/2003456.pdf' },
    ],
    origin: 'dip',
    oracle: {
      provider: 'dip-bundestag',
      documentId: 'dip-34567',
      dokumentnummer: '20/3456',
      wahlperiode: 20,
      pdfUrl: 'https://dserver.bundestag.de/btd/20/034/2003456.pdf',
    },
  },
];
