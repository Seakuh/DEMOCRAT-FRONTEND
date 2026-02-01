import { useQuery } from '@tanstack/react-query';
import { fetchGesetzentwuerfe } from '../oracle/dip';

export function useDipGesetzentwuerfe() {
  return useQuery({
    queryKey: ['dip', 'gesetzentwuerfe'],
    queryFn: () => fetchGesetzentwuerfe(),
    retry: 1,
    refetchInterval: 5 * 60 * 1000,
    staleTime: 3 * 60 * 1000,
  });
}
