import { useEffect, useRef } from 'react';
import useRefValue from './useRefValue';

function checkCSSVisibility(element) {
  const style = window.getComputedStyle(element);
  if (style.display === 'none' || style.visibility !== 'visible') {
    return false;
  }

  const parentWithOverflow =
    element.closest(':not(body):not(html)[style*="overflow: hidden"]') ||
    element.closest(':not(body):not(html)[style*="overflowX: hidden"]') ||
    element.closest(':not(body):not(html)[style*="overflowY: hidden"]');
  if (parentWithOverflow) {
    const parentBounds = parentWithOverflow.getBoundingClientRect();
    const elemBounds = element.getBoundingClientRect();

    if (
      elemBounds.right < parentBounds.left ||
      elemBounds.left > parentBounds.right ||
      elemBounds.bottom < parentBounds.top ||
      elemBounds.top > parentBounds.bottom
    ) {
      return false; // Element is entirely outside its parent
    }
  }

  return true;
}

export function useInView(callback, options = {}) {
  const ref = useRef(null);
  const callbackRef = useRefValue(callback);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          if (checkCSSVisibility(ref.current)) {
            callbackRef.current();
          }
          if (!options.alwaysObserve) {
            observer.unobserve(ref.current);
          }
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
        ...options,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(ref.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
