import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { listComments, addComment } from '../mock/api';
import { getCurrentUser } from '../mock/user';

export function useComments(measureId: string) {
  return useQuery({
    queryKey: ['comments', measureId],
    queryFn: () => listComments(measureId),
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();
  const user = getCurrentUser();

  return useMutation({
    mutationFn: ({ measureId, body }: { measureId: string; body: string }) =>
      addComment(measureId, body, user.id, user.displayName),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.measureId] });
    },
  });
}
