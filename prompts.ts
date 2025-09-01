
import React from 'react';
import ImageIcon from './components/icons/ImageIcon';
import DocumentTextIcon from './components/icons/DocumentTextIcon';
import VideoCameraIcon from './components/icons/VideoCameraIcon';
import PresentationChartBarIcon from './components/icons/PresentationChartBarIcon';

export interface Prompt {
  id?: string;
  title: string;
  description: string;
  prompt: string;
}

export interface SubCategory {
  name: string;
  prompts: Prompt[];
}

export interface Category {
  name: string;
  description: string;
  Icon: React.ElementType;
  subCategories: SubCategory[];
}

export const PROMPT_LIBRARY: Category[] = [
  {
    name: 'Генерация Изображений',
    description: 'Промпты для создания визуальных шедевров, от портретов до фантастических пейзажей.',
    Icon: ImageIcon,
    subCategories: [
      {
        name: 'Портреты',
        prompts: [
          {
            title: 'Кинематографический портрет',
            description: 'Создает драматический, эмоциональный портрет в стиле кадра из фильма.',
            prompt: 'cinematic portrait of a mysterious woman in a dimly lit, smoky 1940s noir cafe, dramatic low-key lighting, rim light highlighting her features, thoughtful expression, shallow depth of field, 8k, photorealistic, film grain',
          },
          {
            title: 'Фэнтези-персонаж',
            description: 'Генерирует детализированный портрет эльфийской волшебницы.',
            prompt: 'epic fantasy character portrait of an elven sorceress, intricate silver armor with glowing runes, long white hair, mystical forest background with ancient trees, ethereal glowing particles, oil painting style, by Greg Rutkowski and Artgerm, hyper-detailed',
          },
           {
            title: 'Киберпанк-андроид',
            description: 'Портрет в стиле киберпанк с неоновым освещением и футуристичными деталями.',
            prompt: 'cyberpunk android portrait, neon-lit alley in a futuristic city, rain-slicked streets reflecting city lights, glowing circuits visible on skin, intense gaze, high contrast, cinematic, Blade Runner aesthetic',
          },
        ],
      },
      {
        name: 'Пейзажи',
        prompts: [
          {
            title: 'Мистический лес',
            description: 'Создает волшебный, туманный лесной пейзаж с неземным свечением.',
            prompt: 'enchanted mystical forest at dawn, thick fog rolling over the ground, ancient mossy trees, shafts of ethereal light breaking through the canopy, glowing mushrooms, serene and mysterious mood, digital painting, ultra-detailed',
          },
          {
            title: 'Футуристический город',
            description: 'Генерирует панораму огромного мегаполиса будущего с летающими автомобилями.',
            prompt: 'sprawling futuristic cyberpunk megalopolis at night, towering skyscrapers with holographic ads, flying vehicles leaving light trails, neon glow, wide-angle drone shot, cinematic, immense scale, 8k resolution',
          },
        ],
      },
    ],
  },
  {
    name: 'Создание Текста',
    description: 'Промпты для AI-копирайтинга, творческого письма и решения бизнес-задач.',
    Icon: DocumentTextIcon,
    subCategories: [
        {
            name: 'Копирайтинг',
            prompts: [
                 {
                    title: 'Рекламный слоган',
                    description: 'Создать 5 коротких и запоминающихся слоганов для нового бренда кофе.',
                    prompt: 'Generate 5 short, catchy, and memorable advertising slogans for a new premium coffee brand named "Aura Beans". The target audience is young professionals who value quality and sustainability.',
                },
                {
                    title: 'Описание продукта',
                    description: 'Написать убедительное описание для умных часов, выделяя ключевые функции.',
                    prompt: 'Write a compelling product description (around 150 words) for a new smartwatch called "ChronoSync X". Highlight its key features: 1-week battery life, advanced health tracking (ECG, blood oxygen), and a titanium body. The tone should be tech-savvy and aspirational.',
                },
            ],
        },
        {
            name: 'Творчество',
            prompts: [
                {
                    title: 'Идея для рассказа',
                    description: 'Придумать завязку для короткого рассказа в жанре научной фантастики.',
                    // Fix: Changed single quotes to backticks to handle the apostrophe in "isn't".
                    prompt: `Give me a story prompt for a short science fiction story. The story should involve a lonely space lighthouse keeper who receives a message that isn't from Earth.`,
                },
                 {
                    title: 'Стихотворение',
                    description: 'Написать короткое стихотворение о первом снегопаде в городе.',
                    prompt: 'Write a short, evocative poem (3-4 stanzas) about the first snowfall in a bustling city, focusing on the theme of silence and peace it brings.',
                },
            ],
        },
    ]
  },
   {
    name: 'Генерация Видео',
    description: 'Идеи и сценарии для создания коротких видеоклипов с помощью AI. (Экспериментально)',
    Icon: VideoCameraIcon,
    subCategories: [
        {
            name: 'Короткие клипы',
            prompts: [
                 {
                    title: 'Полет дрона',
                    description: 'Создать видео полета дрона над живописными горами на закате.',
                    prompt: 'A breathtaking drone shot flying over snow-capped mountains at sunset, cinematic, epic scale, lens flare, warm golden hour light, 4K video.',
                },
                {
                    title: 'Таймлапс города',
                    description: 'Видео в режиме таймлапс, показывающее оживленное движение в мегаполисе.',
                    prompt: 'A stunning timelapse of a bustling city intersection at night, streaks of car lights, people walking quickly, skyscrapers in the background, vibrant, energetic, 4K video.',
                },
            ],
        },
    ]
  },
   {
    name: 'Для Презентаций',
    description: 'Промпты для создания структуры, контента и идей для ваших презентаций.',
    Icon: PresentationChartBarIcon,
    subCategories: [
        {
            name: 'Структура и контент',
            prompts: [
                 {
                    title: 'Структура презентации',
                    description: 'Создать план презентации из 5 слайдов на тему "Будущее искусственного интеллекта".',
                    prompt: 'Create a 5-slide presentation outline on the topic "The Future of Artificial Intelligence". Include a title for each slide and 3-4 bullet points of key content for each.',
                },
                {
                    title: 'Идея для вступительного слайда',
                    description: 'Придумать сильное начало для презентации, чтобы захватить внимание аудитории.',
                    prompt: 'Suggest three powerful opening hooks (a surprising statistic, a rhetorical question, and a short anecdote) for a presentation about the importance of cybersecurity for small businesses.',
                },
            ],
        },
    ]
  }
];