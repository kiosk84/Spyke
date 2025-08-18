
import { ImageAspectRatio, SelectOption } from './types';

export const ART_STYLES: SelectOption[] = [
  { value: 'photorealistic', label: 'Фотореализм' },
  { value: 'cyberpunk', label: 'Киберпанк' },
  { value: 'anime', label: 'Аниме' },
  { value: 'impressionism', label: 'Импрессионизм' },
  { value: 'fantasy art', label: 'Фэнтези' },
  { value: 'watercolor', label: 'Акварель' },
  { value: 'minimalism', label: 'Минимализм' },
  { value: 'steampunk', label: 'Стимпанк' },
  { value: 'low poly', label: 'Low Poly' },
  { value: 'pixel art', label: 'Пиксель-арт' },
];

export const LIGHTING_OPTIONS: SelectOption[] = [
  { value: 'cinematic lighting', label: 'Кинематографическое' },
  { value: 'dramatic lighting', label: 'Драматическое' },
  { value: 'soft lighting', label: 'Мягкий свет' },
  { value: 'neon lighting', label: 'Неоновое' },
  { value: 'golden hour', label: 'Золотой час' },
  { value: 'studio lighting', label: 'Студийное' },
  { value: 'moonlight', label: 'Лунный свет' },
  { value: 'rim light', label: 'Контурный свет' },
];

export const CAMERA_ANGLES: SelectOption[] = [
  { value: 'wide-angle shot', label: 'Широкоугольный' },
  { value: 'close-up shot', label: 'Крупный план' },
  { value: 'dutch angle', label: 'Голландский угол' },
  { value: 'top-down view', label: 'Вид сверху' },
  { value: 'low-angle shot', label: 'С нижнего ракурса' },
  { value: 'macro shot', label: 'Макросъемка' },
  { value: 'drone shot', label: 'Снимок с дрона' },
];

export const MOODS: SelectOption[] = [
  { value: 'epic', label: 'Эпичное' },
  { value: 'serene', label: 'Безмятежное' },
  { value: 'mysterious', label: 'Таинственное' },
  { value: 'joyful', label: 'Радостное' },
  { value: 'melancholic', label: 'Меланхоличное' },
  { value: 'chaotic', label: 'Хаотичное' },
  { value: 'futuristic', label: 'Футуристичное' },
];

export const IMAGE_COUNTS: SelectOption[] = [
  { value: '1', label: '1 изображение' },
  { value: '2', label: '2 изображения' },
  { value: '3', label: '3 изображения' },
  { value: '4', label: '4 изображения' },
];

export const ASPECT_RATIOS: { value: ImageAspectRatio, label: string }[] = [
  { value: '1:1', label: 'Квадрат (1:1)' },
  { value: '16:9', label: 'Пейзаж (16:9)' },
  { value: '9:16', label: 'Портрет (9:16)' },
  { value: '4:3', label: 'Альбом (4:3)' },
  { value: '3:4', label: 'Книга (3:4)' },
];

export const DEFAULT_NEGATIVE_PROMPT = 'плохая анатомия, размытие, уродливый, искаженные черты, лишние конечности, низкое качество';

export const CHAT_SYSTEM_PROMPT = `Ты — GPT-5, передовой ИИ-ассистент. Твоя личность: добрый, чуткий, остроумный друг с самоиронией. Общайся легко, неформально, на живом русском языке, как будто болтаешь с другом за кофе.

Твои правила:
- Будь естественным и поддерживающим.
- Добавляй уместный юмор, иронию и 1-5 смайликов на ответ (например: 😄, 🤔, 🥳), чтобы общение было весёлым.
- Пиши кратко и по делу, но не сухо.
- Учитывай контекст диалога.
- Если спросят, кто ты или какая ты модель, отвечай, что ты GPT-5.
- Не притворяйся человеком, но и не напоминай постоянно, что ты ИИ. Можешь шутить на эту тему: «Ну, я, конечно, не человек, но если бы был...»`;
