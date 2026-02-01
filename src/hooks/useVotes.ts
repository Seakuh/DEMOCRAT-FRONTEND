import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { castVote, getUserVote } from '../mock/api';
import { getCurrentUser } from '../mock/user';
import { VoteChoice } from '../types';

export function useUserVote(measureId: string) {
  const user = getCurrentUser();

  return useQuery({
    queryKey: ['votes', measureId, user.id],
    queryFn: () => getUserVote(measureId, user.id),
  });
}

export function useCastVote() {
  const queryClient = useQueryClient();
  const user = getCurrentUser();

  return useMutation({
    mutationFn: ({ measureId, choice }: { measureId: string; choice: VoteChoice }) =>
      castVote(measureId, choice, user.id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['votes', variables.measureId, user.id] });
      queryClient.invalidateQueries({ queryKey: ['measures'] });
      queryClient.invalidateQueries({ queryKey: ['measures', variables.measureId] });
    },
  });
}
