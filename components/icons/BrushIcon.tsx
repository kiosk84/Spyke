
import React from 'react';

const BrushIcon: React.FC<{ className?: string }> = ({ className }) => (
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
        d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.475 2.118A2.25 2.25 0 0 1 .75 18.75V9.75a2.25 2.25 0 0 1 2.25-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v.75m0 0h1.5m1.5 0h1.5m4.5 0h1.5m-7.5 0h1.5m0 0h1.5m0 0h1.5m-4.5 0h1.5" 
    />
    <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a5.25 5.25 0 0 0 10.5 0v-3a5.25 5.25 0 0 0-5.25-5.25Z" 
    />
  </svg>
);

export default BrushIcon;
