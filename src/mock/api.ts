import { Measure, Vote, Comment, VoteChoice } from '../types';
import { seedMeasures } from './seed';

const MEASURES_KEY = 'measures.local';
const VOTES_KEY = 'votes.local';
const COMMENTS_KEY = 'comments.local';

function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setToStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function initializeStorage(): void {
  const existing = getFromStorage<Measure[]>(MEASURES_KEY, []);
  if (existing.length === 0) {
    setToStorage(MEASURES_KEY, seedMeasures);
  }
}

export async function listLocalMeasures(): Promise<Measure[]> {
  return getFromStorage<Measure[]>(MEASURES_KEY, seedMeasures);
}

export async function getLocalMeasure(id: string): Promise<Measure | null> {
  const measures = await listLocalMeasures();
  return measures.find((m) => m.id === id) || null;
}

export async function upsertMeasure(measure: Measure): Promise<Measure> {
  const measures = await listLocalMeasures();
  const index = measures.findIndex((m) => m.id === measure.id);

  if (index >= 0) {
    measures[index] = { ...measure, updatedAt: new Date().toISOString() };
  } else {
    measures.unshift({ ...measure, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }

  setToStorage(MEASURES_KEY, measures);
  return measure;
}

export async function getUserVote(measureId: string, userId: string): Promise<Vote | null> {
  const votes = getFromStorage<Vote[]>(VOTES_KEY, []);
  return votes.find((v) => v.measureId === measureId && v.userId === userId) || null;
}

export async function castVote(measureId: string, choice: VoteChoice, userId: string): Promise<Vote> {
  const votes = getFromStorage<Vote[]>(VOTES_KEY, []);
  const measures = await listLocalMeasures();

  const existingVoteIndex = votes.findIndex((v) => v.measureId === measureId && v.userId === userId);

  if (existingVoteIndex >= 0) {
    const oldChoice = votes[existingVoteIndex].choice;
    votes[existingVoteIndex] = {
      ...votes[existingVoteIndex],
      choice,
      createdAt: new Date().toISOString(),
    };

    const measureIndex = measures.findIndex((m) => m.id === measureId);
    if (measureIndex >= 0) {
      measures[measureIndex].totals[oldChoice]--;
      measures[measureIndex].totals[choice]++;
      setToStorage(MEASURES_KEY, measures);
    }

    setToStorage(VOTES_KEY, votes);
    return votes[existingVoteIndex];
  }

  const newVote: Vote = {
    id: `vote-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    measureId,
    userId,
    choice,
    createdAt: new Date().toISOString(),
    tx: { status: 'confirmed' },
  };

  votes.push(newVote);
  setToStorage(VOTES_KEY, votes);

  const measureIndex = measures.findIndex((m) => m.id === measureId);
  if (measureIndex >= 0) {
    measures[measureIndex].totals[choice]++;
    setToStorage(MEASURES_KEY, measures);
  }

  return newVote;
}

export async function listComments(measureId: string): Promise<Comment[]> {
  const comments = getFromStorage<Comment[]>(COMMENTS_KEY, []);
  return comments
    .filter((c) => c.measureId === measureId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function addComment(measureId: string, body: string, userId: string, userDisplayName: string): Promise<Comment> {
  const comments = getFromStorage<Comment[]>(COMMENTS_KEY, []);

  const newComment: Comment = {
    id: `comment-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    measureId,
    userId,
    userDisplayName,
    body,
    createdAt: new Date().toISOString(),
    reactions: { like: 0 },
  };

  comments.push(newComment);
  setToStorage(COMMENTS_KEY, comments);

  return newComment;
}

export async function submitUserMeasure(payload: {
  title: string;
  summary: string;
  category: string;
  userId: string;
  userDisplayName: string;
}): Promise<Measure> {
  const newMeasure: Measure = {
    id: `user-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    title: payload.title,
    summary: payload.summary,
    bodyMarkdown: `# ${payload.title}\n\n${payload.summary}`,
    category: payload.category,
    startAt: new Date().toISOString(),
    endAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'draft',
    quorum: 100,
    totals: { pro: 0, contra: 0, abstain: 0 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sources: [],
    origin: 'user',
    submittedBy: {
      userId: payload.userId,
      displayName: payload.userDisplayName,
    },
  };

  return upsertMeasure(newMeasure);
}
