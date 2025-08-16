import React from 'react';

const CoinIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className={className} viewBox="0 0 20 20" aria-hidden="true">
        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-1.5a6.5 6.5 0 110-13 6.5 6.5 0 010 13zM9 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm1 3a1 1 0 00-1 1v1h-.5a.5.5 0 000 1H9v1a1 1 0 102 0v-1h.5a.5.5 0 000-1H11v-1a1 1 0 00-1-1z"></path>
    </svg>
);

export default CoinIcon;
