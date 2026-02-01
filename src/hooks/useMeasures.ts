import { useQuery } from '@tanstack/react-query';
import { drucksachenApi, api, PaginatedResponse, Drucksache } from '../services/api';

export function useMeasures(search?: string) {
  return useQuery({
    queryKey: ['measures', search],
    queryFn: async () => {
      const response = search 
        ? await api.get<PaginatedResponse<Drucksache>>('/drucksachen/search', { params: { q: search, limit: 50 } })
        : await drucksachenApi.getAll({ limit: 50 });
      return response.data.data;
    },
    refetchInterval: 30000,
  });
}

export function useMeasure(id: string) {
  return useQuery({
    queryKey: ['measures', id],
    queryFn: async () => {
      const response = await drucksachenApi.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}
