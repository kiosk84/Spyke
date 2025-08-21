import { GoogleGenAI } from "@google/genai";
import { ImageAspectRatio, Settings } from '../types';
import { CHAT_SYSTEM_PROMPT } from '../constants';

const getAiClient = () => {
    // API-ключ должен быть получен исключительно из переменных окружения.
    if (!process.env.API_KEY) {
        throw new Error("API-ключ Google не найден в переменных окружения.");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const enhancePrompt = async (settings: Omit<Settings, 'imageCount' | 'aspectRatio'>): Promise<string> => {
    const ai = getAiClient();
    const model = 'gemini-2.5-flash';
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
    try {
        const response = await ai.models.generateContent({
            model,
            contents: metaPrompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error enhancing prompt with Gemini:", error);
        throw new Error(`Не удалось улучшить промпт с помощью Gemini. ${error instanceof Error ? error.message : ''}`);
    }
};

export const sendMessageToChatStream = async (message: string, onChunk: (chunk: string) => void): Promise<void> => {
    const ai = getAiClient();
    const model = 'gemini-2.5-flash';
    try {
        const response = await ai.models.generateContentStream({
            model,
            contents: message,
            config: {
                systemInstruction: CHAT_SYSTEM_PROMPT,
            }
        });

        for await (const chunk of response) {
            onChunk(chunk.text);
        }
    } catch (error) {
        console.error("Error sending message to Gemini stream:", error);
        throw new Error(`Не удалось отправить сообщение в чат Gemini. ${error instanceof Error ? error.message : ''}`);
    }
};

export const generateImages = async (
    prompt: string,
    imageCount: number,
    aspectRatio: ImageAspectRatio
): Promise<string[]> => {
    try {
        const ai = getAiClient();
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: prompt,
            config: {
                numberOfImages: imageCount,
                outputMimeType: 'image/jpeg',
                aspectRatio: aspectRatio,
            },
        });
        
        return response.generatedImages.map(img => `data:image/jpeg;base64,${img.image.imageBytes}`);
    } catch (error) {
        console.error("Error generating images:", error);
        if (error instanceof Error && error.message.includes('API key not valid')) {
             throw new Error("API-ключ Google недействителен. Проверьте конфигурацию сервера.");
        }
        throw new Error(`Не удалось сгенерировать изображения. ${error instanceof Error ? error.message : ''}`);
    }
};