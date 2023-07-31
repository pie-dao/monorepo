import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';

export function useHighlight(componentId: string) {
  const router = useRouter();
  const [overlay, setOverlay] = useState(false);
  const [highlighted, setHighlighted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const highlightQuery = router.query.highlight;

  useEffect(() => {
    const shouldHighlight = highlightQuery === componentId.toString();

    if (shouldHighlight) {
      ref?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
      setOverlay(true);
      setHighlighted(true);
      const timer = setTimeout(() => {
        setOverlay(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [componentId, highlightQuery]);

  return { overlay, highlighted, ref };
}
