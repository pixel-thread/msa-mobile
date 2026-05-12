import http from '@src/shared/utils/http';
import { useQuery } from '@tanstack/react-query';
import { SubscriptionEndpoints, SubscriptionQueryKeys } from '../utils/constants';
import { SubscriptionPlan } from '../types';

export function useSubscriptionPlans() {
  return useQuery({
    queryKey: SubscriptionQueryKeys.plans(),
    queryFn: async () => {
      const response = await http.get<SubscriptionPlan[]>(SubscriptionEndpoints.plans());
      return response.data;
    },
  });
}
