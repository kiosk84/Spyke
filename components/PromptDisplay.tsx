import React, { useState, useEffect } from 'react';
import Button from './common/Button';
import CopyIcon from './icons/CopyIcon';
import CheckIcon from './icons/CheckIcon';

interface PromptDisplayProps {
  prompt: string;
}

const PromptDisplay: React.FC<PromptDisplayProps> = ({ prompt }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
  };

  return (
    <div className="bg-dark-secondary p-6 rounded-2xl shadow-lg border border-dark-tertiary/50 relative">
      <h2 className="text-xl font-bold text-light-primary mb-4 font-display">Улучшенный промпт (на английском)</h2>
      <div className="w-full min-h-[100px] bg-black/40 border border-brand-cyan/30 text-cyan-300 rounded-lg p-4 whitespace-pre-wrap font-mono text-sm shadow-inner shadow-brand-cyan/10">
        {prompt || <span className="text-light-secondary opacity-50">Здесь появится ваш улучшенный промпт...</span>}
      </div>
      {prompt && (
        <Button
          onClick={handleCopy}
          variant="secondary"
          className="absolute top-6 right-6 px-3 py-2"
          aria-label={copied ? "Скопировано!" : "Копировать промпт"}
        >
          {copied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5" />}
        </Button>
      )}
    </div>
  );
};

export default PromptDisplay;