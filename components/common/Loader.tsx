
import React from 'react';

const Loader: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'sm' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`${sizeClasses[size]} border-white border-t-transparent rounded-full animate-spin`} role="status">
      <span className="sr-only">Загрузка...</span>
    </div>
  );
};

export default Loader;
