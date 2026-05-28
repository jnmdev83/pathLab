import { useState, useEffect } from 'react';

/**
 * Custom hook that returns true if the viewport width is below 768px (mobile breakpoint).
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(max-width: 768px)');
    
    // Set initial value
    setIsMobile(mediaQuery.matches);

    // Event listener callback
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaQueryChange);
      return () => mediaQuery.removeEventListener('change', handleMediaQueryChange);
    } else {
      mediaQuery.addListener(handleMediaQueryChange);
      return () => mediaQuery.removeListener(handleMediaQueryChange);
    }
  }, []);

  return isMobile;
}
