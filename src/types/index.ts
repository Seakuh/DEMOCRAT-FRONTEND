export type MeasureStatus = 'draft' | 'active' | 'resolved';

export type MeasureOrigin = 'dip' | 'user';

export type VoteChoice = 'pro' | 'contra' | 'abstain';

export interface Measure {
  id: string;
  title: string;
  summary: string;
  bodyMarkdown: string;
  category: string;
  startAt: string;
  endAt: string;
  status: MeasureStatus;
  quorum: number;
  totals: {
    pro: number;
    contra: number;
    abstain: number;
  };
  createdAt: string;
  updatedAt: string;
  sources: { label: string; url: string }[];
  origin: MeasureOrigin;
  submittedBy?: {
    userId: string;
    displayName: string;
  };
  oracle?: {
    provider: 'dip-bundestag';
    documentId: string;
    dokumentnummer?: string;
    wahlperiode?: number;
    pdfUrl?: string;
    updatedAt?: string;
  };
}

export interface Vote {
  id: string;
  measureId: string;
  userId: string;
  choice: VoteChoice;
  createdAt: string;
  tx?: {
    status: 'idle' | 'pending' | 'confirmed' | 'failed';
    hash?: string;
  };
}

export interface Comment {
  id: string;
  measureId: string;
  userId: string;
  userDisplayName: string;
  body: string;
  createdAt: string;
  reactions?: {
    like: number;
  };
}

export interface DipDocument {
  id: string;
  typ: string;
  dokumentart: string;
  drucksachetyp?: string;
  dokumentnummer: string;
  wahlperiode: number;
  herausgeber: string;
  datum: string;
  aktualisiert: string;
  titel: string;
  fundstelle?: {
    pdf_url?: string;
  };
  urheber?: string[];
  ressort?: string;
}

export interface DipResponse {
  numFound: number;
  cursor?: string;
  documents: DipDocument[];
}

export interface User {
  id: string;
  displayName: string;
}
