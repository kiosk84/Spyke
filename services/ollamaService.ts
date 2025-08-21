import { Settings } from '../types';
import { CHAT_SYSTEM_PROMPT, OLLAMA_URL_KEY, OLLAMA_MODEL_KEY, OLLAMA_PROXY_URL_KEY } from '../constants';

const getProxyUrl = (): string => {
    // URL для API-моста, который проксирует запросы к Ollama.
    return localStorage.getItem(OLLAMA_PROXY_URL_KEY) || '';
}

const getOllamaConfig = () => {
    // Получает конфигурацию Ollama из localStorage.
    const url = localStorage.getItem(OLLAMA_URL_KEY) || '';
    const model = localStorage.getItem(OLLAMA_MODEL_KEY) || '';
    return { url, model };
};

export const isConfigured = (): boolean => {
    return !!(
        localStorage.getItem(OLLAMA_URL_KEY) &&
        localStorage.getItem(OLLAMA_MODEL_KEY) &&
        localStorage.getItem(OLLAMA_PROXY_URL_KEY)
    );
};

// Эта функция используется для живой проверки соединения со страницы настроек.
// Она принимает URL как аргументы, чтобы тестировать значения из полей ввода, а не из хранилища.
export const checkConnection = async (ollamaUrl: string, proxyUrl: string): Promise<{ success: boolean; message: string }> => {
    try {
        const response = await fetch(`${proxyUrl}/api/ollama/check`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ollamaUrl }),
        });
        
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `Ошибка прокси-сервера: ${response.statusText}`);
        }
        
        return { success: true, message: data.message || 'Успешное подключение!' };

    } catch (error) {
        console.error(`Error checking connection via proxy ${proxyUrl}:`, error);
        const message = error instanceof Error ? error.message : 'Не удалось проверить подключение.';
        return { success: false, message: `Ошибка при проверке: ${message}` };
    }
};


const proxyFetch = async (endpoint: string, body: object) => {
    const { url, model } = getOllamaConfig();
    const proxyBaseUrl = getProxyUrl();

    try {
        const response = await fetch(`${proxyBaseUrl}/api/ollama/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ollamaUrl: url,
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
            if (done) {
                // Process any remaining data in the buffer before breaking.
                // This is crucial for handling the final part of the stream.
                if (buffer.trim()) {
                    try {
                        const parsed = JSON.parse(buffer);
                        if (parsed.message?.content) {
                            onChunk(parsed.message.content);
                        }
                    } catch (e) {
                        console.error('Failed to parse final stream chunk:', buffer, e);
                    }
                }
                break;
            }

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