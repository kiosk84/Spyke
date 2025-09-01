
import React from 'react';

const PresentationChartBarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125H3.375m17.25 0a1.125 1.125 0 0 0 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H20.625m-17.25 0h17.25M12 18v-3.75m-4.5-3.75h9M12 10.5v-3.75m-4.5 3.75h9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h12A2.25 2.25 0 0 0 20.25 14.25V3" />
    </svg>
);

export default PresentationChartBarIcon;
