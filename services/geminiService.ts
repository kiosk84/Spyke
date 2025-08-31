
import { GoogleGenAI, Modality } from "@google/genai";
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

export const generatePromptFromImage = async (base64Image: string, mimeType: string): Promise<string> => {
    const ai = getAiClient();
    const model = 'gemini-2.5-flash';
    const metaPrompt = `You are an expert prompt engineer for AI image generation. Analyze this image and create a single, highly-detailed, professional, and artistically rich prompt in English that describes it. The final output must be a comma-separated list of keywords, concepts, and stylistic descriptors. Do not add any conversational text or explanations. Focus on visual details: objects, composition, colors, lighting, style, and mood.`;

    const imagePart = {
        inlineData: {
            data: base64Image,
            mimeType: mimeType,
        },
    };

    const textPart = {
        text: metaPrompt
    };

    try {
        const response = await ai.models.generateContent({
            model,
            contents: { parts: [imagePart, textPart] },
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error generating prompt from image with Gemini:", error);
        throw new Error(`Не удалось создать промпт из изображения. ${error instanceof Error ? error.message : ''}`);
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
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: imageCount,
                outputMimeType: 'image/jpeg',
                aspectRatio: aspectRatio,
            },
        });
        
        const images: string[] = [];
        if (response.generatedImages) {
            for (const generatedImage of response.generatedImages) {
                if (generatedImage.image?.imageBytes) {
                    const base64ImageBytes: string = generatedImage.image.imageBytes;
                    images.push(`data:image/jpeg;base64,${base64ImageBytes}`);
                }
            }
        }
        
        if (images.length === 0) {
            throw new Error('Не удалось сгенерировать изображение. Модель вернула пустой ответ.');
        }

        return images;
    } catch (error) {
        console.error("Error generating images:", error);
        if (error instanceof Error && error.message.includes('API key not valid')) {
             throw new Error("API-ключ Google недействителен. Проверьте конфигурацию сервера.");
        }
        throw new Error(`Не удалось сгенерировать изображения. ${error instanceof Error ? error.message : ''}`);
    }
};

export const editImage = async (
    prompt: string,
    base64ImageData: string,
    mimeType: string,
    aspectRatio: ImageAspectRatio // The parameter is kept for signature consistency but is no longer used in the prompt.
): Promise<string[]> => {
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64ImageData,
                            mimeType: mimeType,
                        },
                    },
                    { text: prompt }
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        
        const images: string[] = [];
        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const base64ImageBytes: string = part.inlineData.data;
                    const resMimeType = part.inlineData.mimeType;
                    images.push(`data:${resMimeType};base64,${base64ImageBytes}`);
                }
            }
        }
        
        if (images.length === 0) {
             const textResponse = response.text?.trim();
            if (textResponse) {
                throw new Error(`Модель не вернула изображение, а ответила текстом: "${textResponse}"`);
            }
            throw new Error('Не удалось отредактировать изображение. Модель вернула пустой ответ.');
        }

        return images;
    } catch (error) {
        console.error("Error editing image:", error);
        if (error instanceof Error && error.message.includes('API key not valid')) {
             throw new Error("API-ключ Google недействителен. Проверьте конфигурацию сервера.");
        }
        throw new Error(`Не удалось отредактировать изображение. ${error instanceof Error ? error.message : ''}`);
    }
};

export const enhanceCustomPrompt = async (userPrompt: string): Promise<string> => {
    const ai = getAiClient();
    const model = 'gemini-2.5-flash';
    const metaPrompt = `
You are an expert prompt engineer for an AI image editing model. Your task is to take a user's simple idea, written in Russian, and convert it into a detailed, professional, and artistically rich prompt in English.

The final output MUST start with the exact phrase "Задача: отредактировать изображение. Вывод: только изображение, без текста." followed by the detailed English prompt.
Do not add any other conversational text or explanations. The output should be a single, cohesive instruction for the image editing AI.
The prompt should be creative and expand on the user's idea, adding stylistic details.

---
USER'S IDEA (in Russian): "${userPrompt}"
---

Generate the complete, final prompt in English now.
`;
    try {
        const response = await ai.models.generateContent({
            model,
            contents: metaPrompt,
        });
        const enhancedText = response.text.trim();
        if (!enhancedText) {
            throw new Error("Не удалось улучшить промпт, модель вернула пустой ответ.");
        }
        return enhancedText;
    } catch (error) {
        console.error("Error enhancing custom prompt with Gemini:", error);
        throw new Error(`Не удалось улучшить промпт. ${error instanceof Error ? error.message : ''}`);
    }
};
