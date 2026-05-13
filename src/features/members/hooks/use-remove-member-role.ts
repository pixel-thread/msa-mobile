import { useMutation, useQueryClient } from '@tanstack/react-query';
import { memberEndpoints, MemberQueryKeys } from '../utils/constants';
import http from '@src/shared/utils/http';
import type { UserRole } from '@src/shared/types/role';
import type { Member } from '../types';
import { toast } from 'sonner-native';

interface ManageRolePayload {
  id: string;
  role: UserRole;
}

export const useRemoveMemberRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: ManageRolePayload) =>
      http.put<Member>(memberEndpoints.manageRole(id), { role }),
    onSuccess: (data, variables) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: MemberQueryKeys.detail(variables.id) });
        queryClient.invalidateQueries({ queryKey: MemberQueryKeys.all() });
        toast.success(data.message);
        return;
      }
      toast.error(data.message);
      return;
    },
  });
};

