
import React, { useState, useEffect } from 'react';
import CloseIcon from './icons/CloseIcon';
import DownloadIcon from './icons/DownloadIcon';
import ArrowsRightLeftIcon from './icons/ArrowsRightLeftIcon';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalImage: string;
  editedImage: string;
  title?: string;
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({ isOpen, onClose, originalImage, editedImage, title }) => {
  const [sliderPosition, setSliderPosition] = useState(50);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = editedImage;
    link.download = `expert_edited_image.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
        <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg shadow-2xl shadow-brand-cyan/20 bg-dark-tertiary select-none">
            {/* Original Image (Bottom Layer) */}
            <img 
                src={originalImage} 
                alt="Original" 
                className="absolute inset-0 w-full h-full object-contain"
            />
            
            {/* Edited Image (Top Layer, clipped) */}
            <div className="absolute inset-0 w-full h-full">
                <img
                    src={editedImage}
                    alt="Edited"
                    className="absolute inset-0 w-full h-full object-contain"
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                />
            </div>
            
            {/* Slider Controls */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white/80 cursor-ew-resize pointer-events-none"
                style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            >
                <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm text-dark-primary">
                    <ArrowsRightLeftIcon className="w-5 h-5" />
                </div>
            </div>
            
            <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="absolute inset-0 w-full h-full cursor-ew-resize opacity-0"
                aria-label="Image comparison slider"
            />
        </div>

        {title && <h3 className="absolute top-4 left-4 text-white font-bold text-lg bg-black/50 px-3 py-1 rounded-lg">{title}</h3>}

        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 z-10 p-2 bg-dark-tertiary rounded-full text-white hover:bg-brand-cyan transition-colors"
          aria-label="Close"
        >
          <CloseIcon className="w-6 h-6" />
        </button>
        
        <button
          onClick={handleDownload}
          className="absolute bottom-4 left-4 p-3 bg-white/20 rounded-full text-white backdrop-blur-sm hover:bg-white/30 transition-colors"
          aria-label="Скачать изображение"
        >
          <DownloadIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ComparisonModal;
