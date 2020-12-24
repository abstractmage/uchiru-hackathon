import { useCallback } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useFunction = (value: any) => {
  return useCallback(() => {
    if (typeof value === 'function') value();
  }, [value]);
};
