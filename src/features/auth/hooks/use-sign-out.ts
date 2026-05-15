import http from '@src/shared/utils/http';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore, useSecureTokenStore } from '../store';
import { authEndpoints } from '../utils';
import { toast } from 'sonner-native';

export function useSignOut() {
  const { refreshToken, clearAll } = useSecureTokenStore();
  const { logout } = useAuthStore((state) => ({ logout: state.logout }));

  return useMutation({
    mutationFn: async () =>
      http.post(authEndpoints.signOut, {
        token: refreshToken,
      }),
    onSuccess: (data) => {
      if (data.success) {
        logout();
        clearAll();
        toast.success(data.message);
        return;
      }
      toast.error(data.message);
      return;
    },
  });
}
