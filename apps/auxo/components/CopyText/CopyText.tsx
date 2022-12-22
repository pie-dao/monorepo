import React, { useState } from 'react';
import {
  ClipboardCopyIcon,
  ClipboardCheckIcon,
} from '@heroicons/react/outline';

interface Props {
  text: string;
}

const CopyToClipboard: React.FC<Props> = (props) => {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(props.text).then(() => {
        setCopied(true);
      });
    }
  }

  function handleReset() {
    setCopied(false);
  }

  return (
    <span className="inline-flex p-1 bg-gray-200 rounded gap-x-2 overflow-hidden justify-between items-center min-h-[30px]">
      <code className="text-xs">{props.text}</code>
      <div>
        {copied ? (
          <ClipboardCheckIcon onClick={handleReset} className="h-4 w-4" />
        ) : (
          <ClipboardCopyIcon
            onClick={handleCopy}
            className="h-4 w-4 cursor-pointer"
          />
        )}
      </div>
    </span>
  );
};

export default CopyToClipboard;
