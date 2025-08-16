import React, { useState } from 'react';
import Loader from './common/Loader';
import EnlargeIcon from './icons/EnlargeIcon';
import ImageModal from './ImageModal';

interface ImageGalleryProps {
  images: string[];
  isGenerating: boolean;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, isGenerating }) => {
  const [modalState, setModalState] = useState<{ isOpen: boolean; index: number | null }>({
    isOpen: false,
    index: null,
  });

  const openModal = (index: number) => {
    setModalState({ isOpen: true, index });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, index: null });
  };
  
  const handleNavigation = (direction: 'prev' | 'next') => {
    if (modalState.index === null) return;
    
    const totalImages = images.length;
    let newIndex;
    if (direction === 'prev') {
      newIndex = (modalState.index - 1 + totalImages) % totalImages;
    } else {
      newIndex = (modalState.index + 1) % totalImages;
    }
    setModalState(prev => ({ ...prev, index: newIndex }));
  };

  const renderContent = () => {
    if (isGenerating && images.length === 0) {
      return (
        <div className="text-center">
          <Loader size="lg" />
          <p className="mt-4 text-light-secondary">Магия в процессе... Это может занять минуту.</p>
        </div>
      );
    }

    if (!isGenerating && images.length === 0) {
      return <p className="text-light-secondary text-center">Ваши изображения появятся здесь после генерации.</p>;
    }

    return (
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full self-start">
        {isGenerating && (
          <div className="sm:col-span-2 flex items-center justify-center gap-3 p-3 bg-dark-primary/50 rounded-lg border border-dark-tertiary/50 animate-pulse">
            <Loader size="sm"/>
            <p className="text-light-secondary text-sm">Генерируются новые изображения...</p>
          </div>
        )}
        {images.map((img, index) => (
          <div
            key={index}
            className="relative group rounded-lg overflow-hidden cursor-pointer aspect-square"
            onClick={() => openModal(index)}
            role="button"
            aria-label={`Увеличить изображение ${index + 1}`}
          >
            <img src={img} alt={`Generated image ${index + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
              <div
                className="p-3 bg-white/20 rounded-full text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                aria-hidden="true"
              >
                <EnlargeIcon className="w-8 h-8" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="bg-dark-secondary p-6 rounded-2xl shadow-lg border border-dark-tertiary/50">
        <h2 className="text-xl font-bold text-light-primary mb-4 font-display">Сгенерированные изображения</h2>
        <div className="min-h-[256px] bg-dark-tertiary border border-dashed border-gray-600 rounded-lg flex items-center justify-center p-4">
          {renderContent()}
        </div>
      </div>
      {modalState.isOpen && (
        <ImageModal
          images={images}
          currentIndex={modalState.index}
          onClose={closeModal}
          onNavigate={handleNavigation}
        />
      )}
    </>
  );
};

export default ImageGallery;