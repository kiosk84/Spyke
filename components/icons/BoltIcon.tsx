
import React from 'react';

const BoltIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10.5 3.75a.75.75 0 0 1 .75.75v4.5h3.75a.75.75 0 0 1 .684 1.177l-5.25 8.25a.75.75 0 0 1-1.316-.499v-4.5H5.25a.75.75 0 0 1-.684-1.177l5.25-8.25a.75.75 0 0 1 .684-.423Z"
      clipRule="evenodd"
    />
  </svg>
);

export default BoltIcon;
