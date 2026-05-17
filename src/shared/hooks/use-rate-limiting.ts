import { useState, useCallback, useEffect } from 'react';
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

  /**
   * Remaining seconds
   */
  const [retryAfter, setRetryAfter] = useState<number | null>(null);

  /**
   * Countdown timer
   */
  useEffect(() => {
    if (retryAfter === null || retryAfter <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setRetryAfter((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          return null;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [retryAfter]);

  const executeWithLimit = useCallback(
    async (action: () => Promise<void> | void) => {
      /**
       * Prevent parallel execution spam
       */
      if (isProcessing) {
        return;
      }

      setIsProcessing(true);

      try {
        const status = await checkRateLimit(key, {
          limit: options.limit,
          windowMs: options.windowMs,
        });

        if (status.limited) {
          const seconds = status.retryAfter ?? 0;

          setRetryAfter(seconds);

          toast.warning(options.message ?? 'Rate limit reached', {
            description: `Please wait ${seconds}s before trying again.`,
            dismissible: false,
          });

          return;
        }

        /**
         * Reset timer if request succeeds
         */
        setRetryAfter(null);

        await action();
      } finally {
        setIsProcessing(false);
      }
    },
    [key, options, isProcessing]
  );

  return {
    executeWithLimit,
    isProcessing,
    isLimited: retryAfter !== null && retryAfter > 0,
    retryAfter: retryAfter ?? '',
  };
};
