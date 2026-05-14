import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { checkRateLimit } from '../utils/rate-limiting';

interface RateLimitOptions {
  limit: number;
  windowMs: number;
  message?: string;
}

export const useRateLimit = (key: string, options: RateLimitOptions) => {
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

          Alert.alert(
            'Rate Limit Reached',
            options.message || `Please wait ${status.retryAfter}s before trying again.`
          );
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
