import React, { useState, useCallback, useEffect } from 'react';
import SettingsPanel from '../SettingsPanel';
import PromptDisplay from '../PromptDisplay';
import ImageGallery from '../ImageGallery';
import Button from '../common/Button';
import CameraIcon from '../icons/CameraIcon';
import { Settings, Page } from '../../types';
import * as aiService from '../../services/aiService';
import { ART_STYLES, LIGHTING_OPTIONS, CAMERA_ANGLES, MOODS, ASPECT_RATIOS, DEFAULT_NEGATIVE_PROMPT, GENERATOR_SETTINGS_KEY, COST_GENERATE_PER_IMAGE } from '../../constants';
import CoinIcon from '../icons/CoinIcon';

interface GeneratorPageProps {
  onNavigate: (page: Page) => void;
  balance: number;
  onBalanceChange: (newBalance: number | ((prev: number) => number)) => void;
}

const fileToBase64 = (file: File): Promise<{ data: string, mimeType: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            resolve({
                data: result.split(',')[1],
                mimeType: file.type
            });
        };
        reader.onerror = error => reject(error);
    });
};

const GeneratorPage: React.FC<GeneratorPageProps> = ({ onNavigate, balance, onBalanceChange }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const defaultSettings = {
      idea: '',
      style: ART_STYLES[0].value,
      lighting: LIGHTING_OPTIONS[0].value,
      angle: CAMERA_ANGLES[0].value,
      mood: MOODS[0].value,
      negativePrompt: DEFAULT_NEGATIVE_PROMPT,
      imageCount: 1,
      aspectRatio: ASPECT_RATIOS[0].value,
    };
    const savedSettingsJSON = localStorage.getItem(GENERATOR_SETTINGS_KEY);
    if (savedSettingsJSON) {
      try {
        const savedSettings = JSON.parse(savedSettingsJSON);
        return { ...defaultSettings, ...savedSettings };
      } catch (e) {
        console.error("Failed to parse generator settings from localStorage", e);
      }
    }
    return defaultSettings;
  });

  const [enhancedPrompt, setEnhancedPrompt] = useState<string>('');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isEnhancingText, setIsEnhancingText] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState<boolean>(false);
  
  const generationCost = settings.imageCount * COST_GENERATE_PER_IMAGE;
  const hasSufficientBalance = balance >= generationCost;

  useEffect(() => {
    // Save settings to localStorage whenever they change
    localStorage.setItem(GENERATOR_SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    // Cleanup for object URL
    return () => {
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
    };
  }, [imagePreview]);

  const handleSettingsChange = useCallback((field: keyof Settings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleError = (err: any) => {
    const message = err instanceof Error ? err.message : 'Произошла неизвестная ошибка.';
    setError(message);
  };

  const handleImageUpload = useCallback((file: File) => {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
          setError('Размер файла не должен превышать 4 МБ.');
          return;
      }
      if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
      }
      setUploadedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
  }, [imagePreview]);

  const handleImageRemove = useCallback(() => {
      if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
      }
      setUploadedFile(null);
      setImagePreview(null);
  }, [imagePreview]);
  
  const handleAnalyzeImage = useCallback(async () => {
    if (!uploadedFile) return;
    setIsAnalyzingImage(true);
    setError(null);
    setEnhancedPrompt('');
    try {
        const { data, mimeType } = await fileToBase64(uploadedFile);
        const prompt = await aiService.generatePromptFromImage(data, mimeType);
        setEnhancedPrompt(prompt);
    } catch (err: any) {
        handleError(err);
    } finally {
        setIsAnalyzingImage(false);
    }
  }, [uploadedFile]);

  const handleEnhanceText = useCallback(async () => {
    setIsEnhancingText(true);
    setError(null);
    setEnhancedPrompt('');
    try {
      const prompt = await aiService.enhancePrompt({
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
      setIsEnhancingText(false);
    }
  }, [settings]);

  const handleGenerate = useCallback(async () => {
    if (!enhancedPrompt) {
        setError('Сначала необходимо улучшить или сгенерировать промпт.');
        return;
    }
     if (!hasSufficientBalance) {
        setError(`Недостаточно средств. Требуется: ${generationCost}, у вас: ${balance}.`);
        return;
    }
    setIsGenerating(true);
    setError(null);
    try {
      const images = await aiService.generateImages(enhancedPrompt, settings.imageCount, settings.aspectRatio);
      setGeneratedImages(prevImages => [...images, ...prevImages]);
      onBalanceChange(prev => prev - generationCost);
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsGenerating(false);
    }
  }, [enhancedPrompt, settings.imageCount, settings.aspectRatio, balance, onBalanceChange, generationCost, hasSufficientBalance]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <SettingsPanel 
        settings={settings}
        onSettingsChange={handleSettingsChange}
        onEnhanceText={handleEnhanceText}
        isEnhancingText={isEnhancingText}
        onAnalyzeImage={handleAnalyzeImage}
        isAnalyzingImage={isAnalyzingImage}
        onImageUpload={handleImageUpload}
        onImageRemove={handleImageRemove}
        imagePreview={imagePreview}
      />
      <div className="space-y-8">
        <PromptDisplay prompt={enhancedPrompt} />
        <div className="flex flex-col gap-4">
             <Button
                onClick={handleGenerate}
                isLoading={isGenerating}
                disabled={!enhancedPrompt || isEnhancingText || isAnalyzingImage || !hasSufficientBalance}
                className="w-full text-lg"
            >
              <div className="flex items-center justify-center gap-2">
                  <CameraIcon className="w-6 h-6" />
                  <span>Создать изображение</span>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${hasSufficientBalance ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                      <CoinIcon className="w-4 h-4" />
                      <span>{generationCost}</span>
                  </div>
              </div>
            </Button>
            <p className="text-center text-xs text-light-secondary/60">
              *Все операции выполняются с помощью Google AI.*
            </p>
            {error && <div className="bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg text-center">{error}</div>}
        </div>
        <ImageGallery images={generatedImages} isGenerating={isGenerating} />
      </div>
    </div>
  );
};

export default GeneratorPage;