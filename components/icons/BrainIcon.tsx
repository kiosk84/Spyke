
import React from 'react';

const BrainIcon: React.FC<{ className?: string }> = ({ className }) => (
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
      d="M9.5 13.5c0 1.657 1.343 3 3 3s3-1.343 3-3V9.5a2.5 2.5 0 0 0-5 0v4ZM7.5 15.5c0-1.5 1-3.5 2-4.5M16.5 15.5c0-1.5-1-3.5-2-4.5M12 6.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18.5a7.5 7.5 0 1 1 12 0 7.5 7.5 0 0 1-12 0Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 11.5v10"
    />
  </svg>
);

export default BrainIcon;