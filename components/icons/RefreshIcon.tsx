
import React from 'react';

const RefreshIcon: React.FC<{ className?: string, isSpinning?: boolean }> = ({ className, isSpinning }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor" 
        className={`${className} ${isSpinning ? 'animate-spin' : ''}`}
        aria-hidden="true"
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.664 0l3.181-3.183m-3.181-3.182-3.182 3.182a8.25 8.25 0 0 1-11.664 0l-3.181-3.182m3.181 3.182L6.165 5.165m11.664 0l-3.182 3.182" />
    </svg>
);

export default RefreshIcon;