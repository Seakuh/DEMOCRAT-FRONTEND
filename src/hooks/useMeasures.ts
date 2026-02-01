import { useQuery } from '@tanstack/react-query';
import { drucksachenApi } from '../services/api';

export function useMeasures() {
  return useQuery({
    queryKey: ['measures'],
    queryFn: async () => {
      const response = await drucksachenApi.getAll({ limit: 50 });
      return response.data.data;
    },
    refetchInterval: 30000, // Alle 30 Sekunden aktualisieren
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
