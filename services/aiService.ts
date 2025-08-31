
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
 * Генерирует промпт из изображения с помощью Google Gemini.
 * Эта функция всегда использует Google AI.
 */
export const generatePromptFromImage = (base64Image: string, mimeType: string): Promise<string> => {
    return geminiService.generatePromptFromImage(base64Image, mimeType);
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

/**
 * Редактирует изображение на основе текстового промпта с помощью Google AI.
 */
export const editImage = (
  prompt: string,
  base64ImageData: string,
  mimeType: string,
  aspectRatio: ImageAspectRatio
): Promise<string[]> => {
  // Image editing is a Google-specific feature for now
  return geminiService.editImage(prompt, base64ImageData, mimeType, aspectRatio);
};

/**
 * Улучшает и переводит пользовательский промпт для редактора изображений.
 * Эта функция всегда использует Google AI.
 */
export const enhanceCustomPrompt = (userPrompt: string): Promise<string> => {
    return geminiService.enhanceCustomPrompt(userPrompt);
};


export const isOllamaConfigured = ollamaService.isConfigured;
export const getAiProvider = getProvider;
