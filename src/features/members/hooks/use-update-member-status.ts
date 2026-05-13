import { useMutation, useQueryClient } from '@tanstack/react-query';
import { memberEndpoints, MemberQueryKeys } from '../utils/constants';
import http from '@src/shared/utils/http';
import type { UserStatus } from '@src/shared/types/role';
import type { Member } from '../types';
import { toast } from 'sonner-native';

interface UpdateStatusPayload {
  id: string;
  status: UserStatus;
}

export const useUpdateMemberStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: UpdateStatusPayload) =>
      http.patch<Member>(memberEndpoints.updateStatus(id), { status }),
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: MemberQueryKeys.detail(variables.id) });
        queryClient.invalidateQueries({ queryKey: MemberQueryKeys.all() });
        return;
      }
      toast.error(data.message);
      return;
    },
  });
};

