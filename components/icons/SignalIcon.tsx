import React from 'react';

const SignalIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className={className}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.045A9 9 0 0 1 7.5 15a9 9 0 0 1-1.42-5.992m1.42 5.992a9 9 0 0 0 5.992-1.42m5.992-1.42a9.001 9.001 0 0 0-11.984-4.572M16.5 15a9 9 0 0 0-5.992 1.42m5.992-1.42a9 9 0 0 1 1.42 5.992m-1.42-5.992a9 9 0 0 0-1.42-5.992" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a.75.75 0 0 0 .75-.75V12a.75.75 0 0 0-1.5 0v6a.75.75 0 0 0 .75.75Z" />
  </svg>
);

export default SignalIcon;
