
import React from 'react';

const MagicWandIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className={className}
    aria-hidden="true"
  >
    <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.475 2.118A2.25 2.25 0 0 1 .75 18.75V11.25a2.25 2.25 0 0 1 2.25-2.25h2.25a2.25 2.25 0 0 1 2.25 2.25v1.5m3.375-3.375-2.022-2.022a1.5 1.5 0 0 0-2.121 0l-1.5 1.5a1.5 1.5 0 0 0 0 2.121l2.022 2.022m7.5-7.5-2.022-2.022a1.5 1.5 0 0 0-2.121 0l-1.5 1.5a1.5 1.5 0 0 0 0 2.121l2.022 2.022m7.5-7.5-2.022-2.022a1.5 1.5 0 0 0-2.121 0l-1.5 1.5a1.5 1.5 0 0 0 0 2.121l2.022 2.022M3 12.75h1.5m3 0h1.5m3 0h1.5m-7.5 0h1.5" 
    />
  </svg>
);

export default MagicWandIcon;
