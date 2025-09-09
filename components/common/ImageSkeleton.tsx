
import React from 'react';

const ImageSkeleton: React.FC = () => {
    return (
        <div className="relative group rounded-lg overflow-hidden aspect-square bg-dark-tertiary animate-pulse">
            <div className="w-full h-full"></div>
        </div>
    );
};

export default ImageSkeleton;
