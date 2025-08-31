
import React from 'react';

const GlitchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className={className}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5h16.5v15H3.75v-15z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12h5.25m3-1.5h10.5m-10.5 3H21.75" />
  </svg>
);

export default GlitchIcon;
