import { useEffect } from 'react';

export function useEffectOnce(callback) {
  useEffect(() => {
    const returnFn = callback();

    return () => {
      if (returnFn && typeof returnFn === 'function') {
        returnFn();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
