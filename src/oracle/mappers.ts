import { DipDocument, Measure } from '../types';

export function mapDipDocToMeasure(doc: DipDocument): Measure {
  const startAt = doc.datum || new Date().toISOString();
  const endAt = new Date(new Date(startAt).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const bodyParts = [
    `# ${doc.titel}`,
    '',
    `**Dokumentnummer:** ${doc.dokumentnummer}`,
    `**Wahlperiode:** ${doc.wahlperiode}`,
    `**Herausgeber:** ${doc.herausgeber}`,
    `**Datum:** ${new Date(doc.datum).toLocaleDateString('de-DE')}`,
  ];

  if (doc.urheber && doc.urheber.length > 0) {
    bodyParts.push(`**Urheber:** ${doc.urheber.join(', ')}`);
  }

  if (doc.ressort) {
    bodyParts.push(`**Ressort:** ${doc.ressort}`);
  }

  bodyParts.push('', '---', '', doc.titel);

  const sources = [];
  if (doc.fundstelle?.pdf_url) {
    sources.push({
      label: 'DIP Drucksache PDF',
      url: doc.fundstelle.pdf_url,
    });
  }

  return {
    id: `dip-${doc.id}`,
    title: doc.titel,
    summary: `Drucksache ${doc.dokumentnummer} (WP ${doc.wahlperiode})`,
    bodyMarkdown: bodyParts.join('\n'),
    category: doc.drucksachetyp || 'Gesetzentwurf',
    startAt,
    endAt,
    status: 'draft',
    quorum: 500,
    totals: { pro: 0, contra: 0, abstain: 0 },
    createdAt: doc.datum,
    updatedAt: doc.aktualisiert || doc.datum,
    sources,
    origin: 'dip',
    oracle: {
      provider: 'dip-bundestag',
      documentId: doc.id,
      dokumentnummer: doc.dokumentnummer,
      wahlperiode: doc.wahlperiode,
      pdfUrl: doc.fundstelle?.pdf_url,
      updatedAt: doc.aktualisiert,
    },
  };
}
