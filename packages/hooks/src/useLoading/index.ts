import { useCallback, useState } from 'react';

/**
 *
 * @param initialValue
 * @returns
 */
export const useLoading = (initialValue = false) => {
  const [loading, setLoading] = useState(initialValue);

  const startLoading = useCallback(async (fn: () => Promise<void>) => {
    setLoading(true);

    try {
      await fn();
    } catch (error) {
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return [loading, startLoading, setLoading] as const;
};
