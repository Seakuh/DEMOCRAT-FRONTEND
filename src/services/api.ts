import axios, { InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor für JWT Token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Drucksache {
  _id: string;
  dipId: string;
  titel: string;
  dokumentart: string;
  drucksachetyp: string;
  datum: string;
  ressort: string;
  urheber: string[];
  pdfUrl: string;
  abstract: string;
  wahlperiode: number;
  dokumentnummer: string;
  votes: {
    YES: number;
    NO: number;
    ABSTAIN: number;
    total: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const drucksachenApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    ressort?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => api.get<PaginatedResponse<Drucksache>>('/drucksachen', { params }),

  getById: (id: string) => api.get<Drucksache>(`/drucksachen/${id}`),

  getRessorts: () => api.get<string[]>('/drucksachen/ressorts'),
};

export const votesApi = {
  createVote: (drucksacheId: string, vote: 'YES' | 'NO' | 'ABSTAIN') =>
    api.post('/votes', { drucksacheId, vote }),

  getMyVoteForDrucksache: (id: string) =>
    api.get<{ hasVoted: boolean; vote: string | null }>(`/votes/drucksache/${id}`),

  getMyVotes: () => api.get('/votes/my'),
};

export const syncApi = {
  triggerSync: () => api.post('/sync/trigger'),
};
