
import { Settings } from '../types';
import { CHAT_SYSTEM_PROMPT } from '../constants';

export const OLLAMA_URL_STORAGE_ITEM = 'ollama-url';
export const OLLAMA_MODEL_STORAGE_ITEM = 'ollama-model';

const getProxyUrl = (): string => {
    // URL для API-моста, который проксирует запросы к Ollama.
    // Этот адрес должен быть доступен из браузера. Для развернутых версий используется туннель.
    return 'https://adapting-buck-naturally.ngrok-free.app';
}

const getOllamaConfig = () => {
    // Используем значения по умолчанию, так как пользователь больше не настраивает их в UI.
    const url = localStorage.getItem(OLLAMA_URL_STORAGE_ITEM) || 'http://127.0.0.1:11434';
    const model = localStorage.getItem(OLLAMA_MODEL_STORAGE_ITEM) || 'llama3';
    return { url, model };
};

export const isConfigured = (): boolean => {
    // Конфигурация Ollama больше не зависит от пользовательского ввода, считаем ее всегда "настроенной", если выбрана.
    return true;
};

const proxyFetch = async (endpoint: string, body: object, customOllamaUrl?: string) => {
    const { url, model } = getOllamaConfig();
    const proxyBaseUrl = getProxyUrl();

    try {
        const response = await fetch(`${proxyBaseUrl}/api/ollama/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ollamaUrl: customOllamaUrl || url, // Use custom URL if provided (for checks)
                ollamaModel: model,
                ...body,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Ошибка прокси-сервера: ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
         console.error(`Error fetching from proxy for endpoint ${endpoint}:`, error);
        throw new Error(`Не удалось подключиться к API-мосту. Убедитесь, что ваш туннель (ngrok) и локальный сервер запущены (см. README.md). ${error instanceof Error ? error.message : ''}`);
    }
}


export const checkConnection = async (urlToCheck: string): Promise<boolean> => {
    try {
        const data = await proxyFetch('check', {}, urlToCheck);
        return data.success;
    } catch (error) {
        console.error("Ollama connection check failed via proxy:", error);
        return false;
    }
};

export const sendMessageToChat = async (message: string): Promise<string> => {
    const data = await proxyFetch('chat', {
        messages: [{ role: 'user', content: message }],
        system: CHAT_SYSTEM_PROMPT,
        stream: false,
    });
    return data.message?.content?.trim() || 'Не удалось получить ответ от модели.';
};

export const enhancePrompt = async (settings: Omit<Settings, 'imageCount' | 'aspectRatio'>): Promise<string> => {
    const metaPrompt = `
You are an expert prompt engineer for AI image generation.
Create a single, highly-detailed, professional, and artistically rich prompt in English.
The final output must be a comma-separated list of keywords, concepts, and stylistic descriptors.
Do not add any conversational text or explanations.

---
USER'S REQUEST DETAILS:
- Core Idea: ${settings.idea}
- Style: ${settings.style}
- Lighting: ${settings.lighting}
- Camera Angle: ${settings.angle}
- Mood: ${settings.mood}
- Negative Prompt (avoid these): ${settings.negativePrompt}
---
Generate the prompt.
`;
    const data = await proxyFetch('generate', {
        prompt: metaPrompt,
        stream: false,
    });
    return data.response?.trim() || 'Не удалось улучшить промпт.';
};