import { Settings, ImageAspectRatio, AiProvider } from '../types';
import * as geminiService from './geminiService';
import * as ollamaService from './ollamaService';

export const AI_PROVIDER_STORAGE_ITEM = 'ai-provider';

const getAiProvider = (): AiProvider => {
  return (localStorage.getItem(AI_PROVIDER_STORAGE_ITEM) as AiProvider) || 'google';
};

export const isProviderConfigured = (): boolean => {
  const provider = getAiProvider();
  if (provider === 'ollama') {
    return ollamaService.isConfigured();
  }
  return geminiService.isConfigured();
};

export const enhancePrompt = (settings: Omit<Settings, 'imageCount' | 'aspectRatio'>): Promise<string> => {
  const provider = getAiProvider();
  if (provider === 'ollama') {
    return ollamaService.enhancePrompt(settings);
  }
  return geminiService.enhancePrompt(settings);
};

export const sendMessageToChat = (message: string): Promise<string> => {
  const provider = getAiProvider();
  if (provider === 'ollama') {
    return ollamaService.sendMessageToChat(message);
  }
  return geminiService.sendMessageToChat(message);
};

// Генерация изображений эксклюзивна для модели Google Imagen в этом приложении
export const generateImages = (
  prompt: string,
  imageCount: number,
  aspectRatio: ImageAspectRatio
): Promise<string[]> => {
  return geminiService.generateImages(prompt, imageCount, aspectRatio);
};
