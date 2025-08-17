import { GoogleGenAI } from "@google/genai";
import { Settings, ImageAspectRatio } from '../types';

const API_KEY_STORAGE_ITEM = 'google-api-key';

const getAiClient = () => {
    const apiKey = localStorage.getItem(API_KEY_STORAGE_ITEM);
    if (!apiKey) {
        throw new Error("API-ключ не найден. Пожалуйста, введите и сохраните ваш ключ на странице 'Настройки'.");
    }
    return new GoogleGenAI({ apiKey });
};

export const enhancePrompt = async (settings: Omit<Settings, 'imageCount' | 'aspectRatio'>): Promise<string> => {
    const metaPrompt = `
You are an expert prompt engineer for AI image generation models. Your task is to create a single, highly-detailed, professional, and artistically rich prompt in English. This prompt will be used to generate an image. The final output must be in English only, consisting of a comma-separated list of keywords, concepts, and stylistic descriptors. Do not add any conversational text, introductions, explanations, or markdown formatting.

---
USER'S REQUEST DETAILS:
- Core Idea (in Russian): ${settings.idea}
- Desired Style: ${settings.style}
- Desired Lighting: ${settings.lighting}
- Desired Camera Angle: ${settings.angle}
- Desired Mood: ${settings.mood}
- Things to AVOID (Negative Prompt): ${settings.negativePrompt}
---
INSTRUCTIONS:
1. Translate the Russian "Core Idea" into a compelling English concept.
2. Weave together the core idea with the specified style, lighting, camera angle, and mood to create a cohesive artistic vision.
3. Crucially, construct the final prompt to actively AVOID the concepts listed in "Things to AVOID". For example, if the negative prompt is "blurry, bad hands", the positive prompt should include terms like "sharp focus, hyper-detailed, masterpiece, anatomically correct hands".
4. Your final output should be a single block of text: the engineered prompt, ready for an image generation model.
`;

    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: metaPrompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error enhancing prompt:", error);
        if (error instanceof Error && error.message.includes('API key not valid')) {
             throw new Error("Неверный API-ключ. Проверьте ключ на странице 'Настройки'.");
        }
        throw new Error(`Не удалось улучшить промпт. ${error instanceof Error ? error.message : ''}`);
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
             throw new Error("Неверный API-ключ. Проверьте ключ на странице 'Настройки'.");
        }
        throw new Error(`Не удалось сгенерировать изображения. ${error instanceof Error ? error.message : ''}`);
    }
};