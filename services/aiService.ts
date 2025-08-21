import { Settings, ImageAspectRatio, AiProvider } from '../types';
import * as geminiService from './geminiService';
import * as ollamaService from './ollamaService';
import { AI_PROVIDER_KEY } from '../constants';

const getProvider = (): AiProvider => {
    return (localStorage.getItem(AI_PROVIDER_KEY) as AiProvider) || 'google';
};

/**
 * Улучшает промпт пользователя, используя выбранного AI-провайдера.
 */
export const enhancePrompt = (settings: Omit<Settings, 'imageCount' | 'aspectRatio'>): Promise<string> => {
  const provider = getProvider();
  if (provider === 'ollama') {
      if (!ollamaService.isConfigured()) {
          return Promise.reject(new Error('Ollama не настроен. Пожалуйста, проверьте настройки.'));
      }
      return ollamaService.enhancePrompt(settings);
  }
  return geminiService.enhancePrompt(settings);
};

/**
 * Отправляет сообщение в чат и получает потоковый ответ от выбранного AI-провайдера.
 */
export const sendMessageToChatStream = (
  message: string,
  onChunk: (chunk: string) => void
): Promise<void> => {
  const provider = getProvider();
  if (provider === 'ollama') {
      if (!ollamaService.isConfigured()) {
           return Promise.reject(new Error('Ollama не настроен. Пожалуйста, проверьте настройки.'));
      }
      return ollamaService.sendMessageToChatStream(message, onChunk);
  }
  return geminiService.sendMessageToChatStream(message, onChunk);
};

/**
 * Генерирует изображения с помощью Google Imagen.
 * Эта функция всегда использует Google AI, так как Ollama не поддерживает генерацию изображений в текущей конфигурации.
 */
export const generateImages = (
  prompt: string,
  imageCount: number,
  aspectRatio: ImageAspectRatio
): Promise<string[]> => {
  return geminiService.generateImages(prompt, imageCount, aspectRatio);
};

export const isOllamaConfigured = ollamaService.isConfigured;
export const getAiProvider = getProvider;