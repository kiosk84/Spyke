
import React from 'react';

const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639l4.25-8.5a1.012 1.012 0 0 1 1.634 0l4.25 8.5a1.012 1.012 0 0 1 0 .639l-4.25 8.5a1.012 1.012 0 0 1-1.634 0l-4.25-8.5Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

export default EyeIcon;