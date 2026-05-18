import { useMutation, useQueryClient } from '@tanstack/react-query';
import { memberEndpoints, MemberQueryKeys } from '../utils/constants';
import http from '@src/shared/utils/http';
import type { UserStatus, UserRole } from '@src/shared/types/role';
import type { Member } from '../types';
import { toast } from 'sonner-native';

interface UpdateStatusPayload {
  id: string;
  memberTypeId?: string;
  role?: UserRole;
  dateOfJoiningGovt?: Date;
  dateOfJoiningMfsa?: Date;
  status: UserStatus;
}

export const useUpdateMemberStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateStatusPayload) =>
      http.post<Member>(memberEndpoints.updateStatus(data.id), data),
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
