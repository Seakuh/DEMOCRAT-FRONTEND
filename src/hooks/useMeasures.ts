import { useQuery } from '@tanstack/react-query';
import { drucksachenApi, api, PaginatedResponse, Drucksache } from '../services/api';

export function useMeasures(search?: string, dateRange?: { start?: string; end?: string }) {
  return useQuery({
    queryKey: ['measures', search, dateRange],
    queryFn: async () => {
      const params: any = { limit: 50 };
      if (search) params.q = search;
      if (dateRange?.start) params.startDate = dateRange.start;
      if (dateRange?.end) params.endDate = dateRange.end;

      const response = search 
        ? await api.get<PaginatedResponse<Drucksache>>('/drucksachen/search', { params })
        : await drucksachenApi.getAll(params);
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
