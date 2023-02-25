import { useEffect } from 'react';

export function useListener(value, callback) {
  useEffect(() => {
    callback(value);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
}
