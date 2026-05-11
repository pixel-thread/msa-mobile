import http from '@src/shared/utils/http';
import { useQuery } from '@tanstack/react-query';
import { SubscriptionEndpoints } from '../utils/constants/endpoints';
import { SubscriptionPlan } from '../types';

export function useSubscriptionPlans() {
  return useQuery({
    queryKey: ['subscriptions', 'plans'],
    queryFn: async () => {
      const response = await http.get<SubscriptionPlan[]>(SubscriptionEndpoints.plans());
      return response.data;
    },
  });
}
