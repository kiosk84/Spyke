
import React from 'react';

const SparkleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-7.19c0-1.767-.933-3.34-2.386-4.154a.75.75 0 01-.416-1.012l.001-.002c.118-.38.455-.64.84-.643h3.614zM2.25 12a.75.75 0 01.75-.75h3.614a.75.75 0 01.84.643l.001.002a.75.75 0 01-.416 1.012A4.498 4.498 0 005.41 15.31v7.19a.75.75 0 01-.75.75a6.75 6.75 0 01-6.75-6.75c0-1.69.59-3.262 1.56-4.436z"
      clipRule="evenodd"
    />
  </svg>
);

export default SparkleIcon;
