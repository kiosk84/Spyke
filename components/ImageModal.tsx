import React, { useEffect } from 'react';
import CloseIcon from './icons/CloseIcon';
import DownloadIcon from './icons/DownloadIcon';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import ArrowRightIcon from './icons/ArrowRightIcon';

interface ImageModalProps {
  images: string[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ images, currentIndex, onClose, onNavigate }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate('prev');
      if (e.key === 'ArrowRight') onNavigate('next');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNavigate]);

  if (currentIndex === null) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = images[currentIndex];
    link.download = `iskra_image_${currentIndex + 1}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const currentImage = images[currentIndex];

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
        <img
          src={currentImage}
          alt={`Generated image ${currentIndex + 1}`}
          className="object-contain w-full h-full max-h-[90vh] rounded-lg shadow-2xl shadow-brand-cyan/20"
        />

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

        {images.length > 1 && (
          <>
            <button
              onClick={() => onNavigate('prev')}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 rounded-full text-white backdrop-blur-sm hover:bg-white/30 transition-colors"
              aria-label="Предыдущее изображение"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <button
              onClick={() => onNavigate('next')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 rounded-full text-white backdrop-blur-sm hover:bg-white/30 transition-colors"
              aria-label="Следующее изображение"
            >
              <ArrowRightIcon className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageModal;
