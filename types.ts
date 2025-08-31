
export interface Settings {
  idea: string;
  style: string;
  lighting: string;
  angle: string;
  mood: string;
  negativePrompt: string;
  imageCount: number;
  aspectRatio: ImageAspectRatio;
}

export type ImageAspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";

export interface SelectOption {
  value: string;
  label: string;
}

export type AiProvider = 'google' | 'ollama';

export type Page = 'generator' | 'editor' | 'info' | 'history' | 'chat' | 'settings' | 'landing' | 'timeMachine';