import React, { ReactNode } from 'react';
import { useHighlight } from '../../hooks/useHighlight';

interface HighlightProps {
  id: string;
  children: ReactNode;
}

const Highlight: React.FC<HighlightProps> = ({ id, children }) => {
  const { overlay, highlighted, ref } = useHighlight(id);

  return (
    <div className="isolate z-10" ref={ref}>
      {overlay && <div className="fixed inset-0 bg-black opacity-50 z-10" />}
      <div className={highlighted ? 'ring-pulse z-20 relative' : ''}>
        {children}
      </div>
    </div>
  );
};

export default Highlight;
