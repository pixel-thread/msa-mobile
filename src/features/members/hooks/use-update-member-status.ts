import { useMutation, useQueryClient } from '@tanstack/react-query';
import { memberEndpoints, MemberQueryKeys } from '../utils/constants';
import http from '@src/shared/utils/http';
import type { UserStatus } from '@src/shared/types/role';
import type { Member } from '../types';

interface UpdateStatusPayload {
  id: string;
  status: UserStatus;
}

export const useUpdateMemberStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: UpdateStatusPayload) => {
      const response = await http.patch<{ data: Member }>(memberEndpoints.updateStatus(id), { status });
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate both the detail view and the lists
      queryClient.invalidateQueries({ queryKey: MemberQueryKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: MemberQueryKeys.all() });
    },
  });
};