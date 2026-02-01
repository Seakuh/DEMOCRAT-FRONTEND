import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitUserMeasure } from '../mock/api';
import { getCurrentUser } from '../mock/user';

export function useSubmitProposal() {
  const queryClient = useQueryClient();
  const user = getCurrentUser();

  return useMutation({
    mutationFn: (payload: { title: string; summary: string; category: string }) =>
      submitUserMeasure({
        ...payload,
        userId: user.id,
        userDisplayName: user.displayName,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['measures'] });
    },
  });
}
