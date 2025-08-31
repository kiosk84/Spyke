import React, { DragEvent, useState } from 'react';
import {
  ART_STYLES,
  LIGHTING_OPTIONS,
  CAMERA_ANGLES,
  MOODS,
  IMAGE_COUNTS,
  ASPECT_RATIOS,
  DEFAULT_NEGATIVE_PROMPT
} from '../constants';
import { Settings } from '../types';
import SelectInput from './common/SelectInput';
import Button from './common/Button';
import SparkleIcon from './icons/SparkleIcon';
import ImageIcon from './icons/ImageIcon';
import TrashIcon from './icons/TrashIcon';

interface SettingsPanelProps {
  settings: Settings;
  onSettingsChange: (field: keyof Settings, value: any) => void;
  onEnhanceText: () => void;
  isEnhancingText: boolean;
  onAnalyzeImage: () => void;
  isAnalyzingImage: boolean;
  onImageUpload: (file: File) => void;
  onImageRemove: () => void;
  imagePreview: string | null;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onSettingsChange,
  onEnhanceText,
  isEnhancingText,
  onAnalyzeImage,
  isAnalyzingImage,
  onImageUpload,
  onImageRemove,
  imagePreview
}) => {
  const [ideaOnFocus, setIdeaOnFocus] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onSettingsChange(e.target.name as keyof Settings, e.target.value);
  };
  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.name === 'imageCount' ? parseInt(e.target.value, 10) : e.target.value;
    onSettingsChange(e.target.name as keyof Settings, value);
  };

  const isTextSettingsDisabled = !!imagePreview;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        onImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleIdeaFocus = () => {
    setIdeaOnFocus(settings.idea);
  };

  const handleIdeaBlur = () => {
    if (
        settings.idea.trim() &&
        settings.idea !== ideaOnFocus &&
        !isTextSettingsDisabled &&
        !isEnhancingText
    ) {
        onEnhanceText();
    }
  };


  return (
    <div className="bg-dark-secondary p-6 rounded-2xl shadow-lg border border-dark-tertiary/50 space-y-6">
      
      {/* Image Uploader */}
      <h2 className="text-2xl font-bold text-light-primary font-display border-b-2 border-brand-cyan/20 pb-3">Создать промпт по изображению</h2>
      {!imagePreview ? (
        <div 
          className="relative w-full border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-brand-cyan transition-colors duration-300"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
            <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
            />
            <div className="flex flex-col items-center pointer-events-none">
                <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />
                <p className="text-sm text-light-secondary">
                    <span className="font-semibold text-brand-cyan">Нажмите для загрузки</span> или перетащите
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, WEBP (до 4MB)</p>
            </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32">
                <img src={imagePreview} alt="Предпросмотр" className="rounded-lg w-full h-full object-cover shadow-lg"/>
                <button 
                  onClick={onImageRemove} 
                  className="absolute -top-2 -right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-transform hover:scale-110"
                  aria-label="Удалить изображение"
                >
                    <TrashIcon className="w-4 h-4"/>
                </button>
            </div>
            <Button
                onClick={onAnalyzeImage}
                isLoading={isAnalyzingImage}
                className="w-full text-lg"
                Icon={SparkleIcon}
            >
                Анализировать и создать промпт
            </Button>
        </div>
      )}

      <div className="flex items-center text-center">
        <div className="flex-grow border-t border-dark-tertiary"></div>
        <span className="flex-shrink mx-4 text-light-secondary text-sm">ИЛИ</span>
        <div className="flex-grow border-t border-dark-tertiary"></div>
      </div>

      <fieldset disabled={isTextSettingsDisabled} className="space-y-6 disabled:opacity-40 transition-opacity">
        <h2 className="text-2xl font-bold text-light-primary font-display border-b-2 border-brand-cyan/20 pb-3">1. Опишите вашу идею</h2>
        <textarea
          name="idea"
          value={settings.idea}
          onChange={handleInputChange}
          onFocus={handleIdeaFocus}
          onBlur={handleIdeaBlur}
          placeholder="Например: Астронавт едет на лошади по Марсу"
          className="w-full h-24 bg-dark-tertiary border border-gray-600 text-light-primary rounded-lg focus:ring-brand-cyan focus:border-brand-cyan block p-2.5 transition duration-200 resize-none"
        />

        <h2 className="text-2xl font-bold text-light-primary font-display border-b-2 border-brand-cyan/20 pb-3">2. Настройте детали</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectInput label="Художественный стиль" name="style" options={ART_STYLES} value={settings.style} onChange={handleSelectChange} />
          <SelectInput label="Освещение" name="lighting" options={LIGHTING_OPTIONS} value={settings.lighting} onChange={handleSelectChange} />
          <SelectInput label="Ракурс камеры" name="angle" options={CAMERA_ANGLES} value={settings.angle} onChange={handleSelectChange} />
          <SelectInput label="Настроение" name="mood" options={MOODS} value={settings.mood} onChange={handleSelectChange} />
        </div>

        <div>
          <label htmlFor="negativePrompt" className="block text-sm font-medium text-light-secondary mb-1">
            Негативный промпт (чего не должно быть)
          </label>
          <input
            type="text"
            name="negativePrompt"
            id="negativePrompt"
            value={settings.negativePrompt}
            onChange={handleInputChange}
            placeholder={DEFAULT_NEGATIVE_PROMPT}
            className="w-full bg-dark-tertiary border border-gray-600 text-light-primary rounded-lg focus:ring-brand-cyan focus:border-brand-cyan block p-2.5 transition duration-200"
          />
        </div>
        <Button
            onClick={onEnhanceText}
            isLoading={isEnhancingText}
            disabled={!settings.idea.trim() || isTextSettingsDisabled}
            className="w-full text-lg"
            Icon={SparkleIcon}
          >
            Улучшить промпт по тексту
        </Button>
      </fieldset>

      <h2 className="text-2xl font-bold text-light-primary font-display border-b-2 border-brand-cyan/20 pb-3">3. Настройки вывода</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectInput label="Количество изображений" name="imageCount" options={IMAGE_COUNTS} value={String(settings.imageCount)} onChange={handleSelectChange} />
        <SelectInput label="Соотношение сторон" name="aspectRatio" options={ASPECT_RATIOS} value={settings.aspectRatio} onChange={handleSelectChange} />
      </div>
    </div>
  );
};

export default SettingsPanel;