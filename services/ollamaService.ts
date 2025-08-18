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
    // Получает конфигурацию Ollama из localStorage или использует значения по умолчанию.
    const url = localStorage.getItem(OLLAMA_URL_STORAGE_ITEM) || 'http://192.168.0.105:11434';
    const model = localStorage.getItem(OLLAMA_MODEL_STORAGE_ITEM) || 'gemma3n';
    return { url, model };
};

export const isConfigured = (): boolean => {
    // По требованию пользователя, считаем Ollama настроенным по умолчанию.
    // Это предполагает, что локальный сервер, API-мост и туннель запущены.
    // Функции этого сервиса будут использовать конфигурацию из localStorage или
    // значения по умолчанию, если ничего не сохранено.
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

export const sendMessageToChatStream = async (message: string, onChunk: (chunk: string) => void): Promise<void> => {
    const { url, model } = getOllamaConfig();
    const proxyBaseUrl = getProxyUrl();

    try {
        const response = await fetch(`${proxyBaseUrl}/api/ollama/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ollamaUrl: url,
                ollamaModel: model,
                messages: [{ role: 'user', content: message }],
                system: CHAT_SYSTEM_PROMPT,
                stream: true,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Ошибка прокси-сервера: ${response.statusText}`);
        }
        
        if (!response.body) {
            throw new Error('Response body is null');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // Keep the last, potentially incomplete line

            for (const line of lines) {
                if (line.trim() === '') continue;
                try {
                    const parsed = JSON.parse(line);
                    if (parsed.message?.content) {
                        onChunk(parsed.message.content);
                    }
                } catch (e) {
                    console.error('Failed to parse stream chunk:', line, e);
                }
            }
        }

    } catch (error) {
        console.error(`Error fetching from proxy stream for chat:`, error);
        throw new Error(`Не удалось подключиться к API-мосту. Убедитесь, что ваш туннель (ngrok) и локальный сервер запущены. ${error instanceof Error ? error.message : ''}`);
    }
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
