import { useQuery } from '@tanstack/react-query';
import { drucksachenApi, api, PaginatedResponse, Drucksache } from '../services/api';

export function useMeasures(
  search?: string,
  dateRange?: { start?: string; end?: string },
  category?: string
) {
  return useQuery({
    queryKey: ['measures', search, dateRange, category],
    queryFn: async () => {
      const params: any = { limit: 50 };
      if (search) params.q = search;
      if (dateRange?.start) params.startDate = dateRange.start;
      if (dateRange?.end) params.endDate = dateRange.end;
      if (category) params.category = category;

      const response = search
        ? await api.get<PaginatedResponse<Drucksache>>('/drucksachen/search', { params })
        : await drucksachenApi.getAll(params);
      return response.data.data;
    },
    refetchInterval: 30000,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await drucksachenApi.getCategories();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 Minuten Cache
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
