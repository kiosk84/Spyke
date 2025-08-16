import React from 'react';
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

interface SettingsPanelProps {
  settings: Settings;
  onSettingsChange: (field: keyof Settings, value: any) => void;
  onEnhance: () => void;
  isEnhancing: boolean;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onSettingsChange,
  onEnhance,
  isEnhancing
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onSettingsChange(e.target.name as keyof Settings, e.target.value);
  };
  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.name === 'imageCount' ? parseInt(e.target.value, 10) : e.target.value;
    onSettingsChange(e.target.name as keyof Settings, value);
  };

  return (
    <div className="bg-dark-secondary p-6 rounded-2xl shadow-lg border border-dark-tertiary/50 space-y-6">
      <h2 className="text-2xl font-bold text-light-primary font-display border-b-2 border-brand-cyan/20 pb-3">1. Опишите вашу идею</h2>
      <textarea
        name="idea"
        value={settings.idea}
        onChange={handleInputChange}
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

      <h2 className="text-2xl font-bold text-light-primary font-display border-b-2 border-brand-cyan/20 pb-3">3. Настройки вывода</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectInput label="Количество изображений" name="imageCount" options={IMAGE_COUNTS} value={String(settings.imageCount)} onChange={handleSelectChange} />
        <SelectInput label="Соотношение сторон" name="aspectRatio" options={ASPECT_RATIOS} value={settings.aspectRatio} onChange={handleSelectChange} />
      </div>

      <Button
        onClick={onEnhance}
        isLoading={isEnhancing}
        disabled={!settings.idea.trim()}
        className="w-full text-lg"
        Icon={SparkleIcon}
      >
        Улучшить промпт
      </Button>
    </div>
  );
};

export default SettingsPanel;