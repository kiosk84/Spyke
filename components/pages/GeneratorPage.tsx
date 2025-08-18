import React, { useState, useCallback, useEffect } from 'react';
import SettingsPanel from '../SettingsPanel';
import PromptDisplay from '../PromptDisplay';
import ImageGallery from '../ImageGallery';
import Button from '../common/Button';
import CameraIcon from '../icons/CameraIcon';
import ApiKeyPrompt from '../common/ApiKeyPrompt';
import { Settings, Page } from '../../types';
import { enhancePrompt, generateImages, isProviderConfigured as checkProviderConfig } from '../../services/aiService';
import { ART_STYLES, LIGHTING_OPTIONS, CAMERA_ANGLES, MOODS, ASPECT_RATIOS, DEFAULT_NEGATIVE_PROMPT } from '../../constants';

interface GeneratorPageProps {
  onNavigate: (page: Page) => void;
}

const GeneratorPage: React.FC<GeneratorPageProps> = ({ onNavigate }) => {
  const [isProviderConfigured, setIsProviderConfigured] = useState(false);

  useEffect(() => {
    const updateConfigStatus = () => {
        setIsProviderConfigured(checkProviderConfig());
    };
    updateConfigStatus();
    // Re-check when window gets focus, in case user updated settings in another tab
    window.addEventListener('focus', updateConfigStatus); 
    // Also re-check when storage changes
    window.addEventListener('storage', updateConfigStatus);
    
    return () => {
        window.removeEventListener('focus', updateConfigStatus);
        window.removeEventListener('storage', updateConfigStatus);
    };
  }, []);

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
    setError(message);
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
      // Генерация всегда использует geminiService, согласно aiService
      const images = await generateImages(enhancedPrompt, settings.imageCount, settings.aspectRatio);
      setGeneratedImages(prevImages => [...images, ...prevImages]);
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsGenerating(false);
    }
  }, [enhancedPrompt, settings.imageCount, settings.aspectRatio]);

  if (!isProviderConfigured) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <ApiKeyPrompt onNavigate={onNavigate} />
      </div>
    );
  }

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