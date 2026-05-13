import { useMutation, useQueryClient } from '@tanstack/react-query';
import { memberEndpoints, MemberQueryKeys } from '../utils/constants';
import http from '@src/shared/utils/http';
import type { UserRole } from '@src/shared/types/role';
import type { Member } from '../types';

interface ManageRolePayload {
  id: string;
  role: UserRole;
}

export const useAddMemberRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, role }: ManageRolePayload) => {
      const response = await http.patch<{ data: Member }>(memberEndpoints.manageRole(id), { role });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: MemberQueryKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: MemberQueryKeys.all() });
    },
  });
};