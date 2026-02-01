import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { votesApi } from '../services/api';
import { VoteChoice } from '../types';

export function useUserVote(measureId: string) {
  return useQuery({
    queryKey: ['votes', measureId],
    queryFn: async () => {
      // Zuerst im localStorage schauen
      const localVotes = JSON.parse(localStorage.getItem('my_votes') || '{}');
      if (localVotes[measureId]) {
        return { choice: localVotes[measureId].toLowerCase() };
      }
      
      try {
        const response = await votesApi.getMyVoteForDrucksache(measureId);
        return response.data.hasVoted ? { choice: response.data.vote?.toLowerCase() } : null;
      } catch (e) {
        return null;
      }
    },
  });
}

export function useCastVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ measureId, choice }: { measureId: string; choice: VoteChoice }) => {
      const voteValue = choice === 'pro' ? 'YES' : choice === 'contra' ? 'NO' : 'ABSTAIN';
      const response = await votesApi.createVote(measureId, voteValue as any);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['votes', variables.measureId] });
      queryClient.invalidateQueries({ queryKey: ['measures'] });
      queryClient.invalidateQueries({ queryKey: ['measures', variables.measureId] });
    },
  });
}
