import { useState, useCallback } from 'react';
import { checkRateLimit } from '../utils/rate-limiting';
import { toast } from 'sonner-native';
import { IRateLimitOptions } from '../types/rate-limiting';

const defaultOptions: IRateLimitOptions = {
  limit: 1,
  windowMs: 60000,
  message: 'Rate limit reached',
};
export const useRateLimit = (key: string, options: IRateLimitOptions = defaultOptions) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);

  const executeWithLimit = useCallback(
    async (action: () => Promise<void> | void) => {
      setIsProcessing(true);

      try {
        const status = await checkRateLimit(key, {
          limit: options.limit,
          windowMs: options.windowMs,
        });

        if (status.limited) {
          setRetryAfter(status.retryAfter ?? 0);
          toast.warning('Rate limit reached', {
            description: `Please wait ${status.retryAfter}s before trying again.`,
            dismissible: false,
          });
          return;
        }

        // If not limited, reset the retry state and run the action
        setRetryAfter(null);
        await action();
      } finally {
        setIsProcessing(false);
      }
    },
    [key, options]
  );

  return {
    executeWithLimit,
    isProcessing,
    isLimited: !!retryAfter,
    retryAfter,
  };
};
