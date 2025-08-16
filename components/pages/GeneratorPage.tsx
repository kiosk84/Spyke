import React, { useState, useCallback } from 'react';
import SettingsPanel from '../SettingsPanel';
import PromptDisplay from '../PromptDisplay';
import ImageGallery from '../ImageGallery';
import Button from '../common/Button';
import CameraIcon from '../icons/CameraIcon';
import { Settings } from '../../types';
import { enhancePrompt, generateImages } from '../../services/geminiService';
import { ART_STYLES, LIGHTING_OPTIONS, CAMERA_ANGLES, MOODS, ASPECT_RATIOS, DEFAULT_NEGATIVE_PROMPT } from '../../constants';

const GeneratorPage: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    idea: '',
    style: ART_STYLES[0].value,
    lighting: LIGHTING_OPTIONS[0].value,
    angle: CAMERA_ANGLES[0].value,
    mood: MOODS[0].value,
    negativePrompt: DEFAULT_NEGATIVE_PROMPT,
    imageCount: 1,
    aspectRatio: ASPECT_RATIOS[0].value,
  });

  const [enhancedPrompt, setEnhancedPrompt] = useState<string>('');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSettingsChange = useCallback((field: keyof Settings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleError = (err: any) => {
    const message = err instanceof Error ? err.message : 'Произошла неизвестная ошибка.';
    // Напрямую показываем информативное сообщение об ошибке из сервиса
    if (message.includes("API-ключ")) {
      setError(message);
    } else {
      setError(message);
    }
  };

  const handleEnhance = useCallback(async () => {
    setIsEnhancing(true);
    setError(null);
    setEnhancedPrompt('');
    try {
      const prompt = await enhancePrompt({
        idea: settings.idea,
        style: settings.style,
        lighting: settings.lighting,
        angle: settings.angle,
        mood: settings.mood,
        negativePrompt: settings.negativePrompt,
      });
      setEnhancedPrompt(prompt);
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsEnhancing(false);
    }
  }, [settings]);

  const handleGenerate = useCallback(async () => {
    if (!enhancedPrompt) {
        setError('Сначала необходимо улучшить промпт.');
        return;
    }
    setIsGenerating(true);
    setError(null);
    try {
      const images = await generateImages(enhancedPrompt, settings.imageCount, settings.aspectRatio);
      setGeneratedImages(prevImages => [...images, ...prevImages]);
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsGenerating(false);
    }
  }, [enhancedPrompt, settings.imageCount, settings.aspectRatio]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <SettingsPanel 
        settings={settings}
        onSettingsChange={handleSettingsChange}
        onEnhance={handleEnhance}
        isEnhancing={isEnhancing}
      />
      <div className="space-y-8">
        <PromptDisplay prompt={enhancedPrompt} />
        <div className="flex flex-col gap-4">
             <Button
                onClick={handleGenerate}
                isLoading={isGenerating}
                disabled={!enhancedPrompt || isEnhancing}
                className="w-full text-lg"
                Icon={CameraIcon}
            >
                Создать изображение
            </Button>
            {error && <div className="bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg text-center">{error}</div>}
        </div>
        <ImageGallery images={generatedImages} isGenerating={isGenerating} />
      </div>
    </div>
  );
};

export default GeneratorPage;