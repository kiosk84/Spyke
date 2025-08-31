
import React from 'react';

const AnimeFaceIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 2a10 10 0 0 0-9.85 11.5c.95 4.95 5.55 8.5 10.85 8.5s9.9-3.55 10.85-8.5A10 10 0 0 0 12 2Z" />
    <path d="M8 14s1.5-2 4-2 4 2 4 2" />
    <path d="M9 9h.01" />
    <path d="M15 9h.01" />
  </svg>
);

export default AnimeFaceIcon;
