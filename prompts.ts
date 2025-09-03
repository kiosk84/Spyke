
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
          {
            title: 'Low Poly Персонаж',
            description: 'Стилизованный 3D-портрет в стиле Low Poly.',
            prompt: `low poly character portrait of a knight, vibrant solid colors, isometric view, simple geometric shapes, clean edges, 3D render, trending on ArtStation`,
          },
          {
            title: 'Винтажное фото',
            description: 'Создает портрет, имитирующий старую фотографию начала 20-го века.',
            prompt: `vintage sepia photograph of a victorian era scientist in his laboratory, circa 1905, slightly faded, film grain, intricate details, authentic clothing, shallow depth of field, sharp focus`,
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
          {
            title: 'Сюрреалистическая пустыня',
            description: 'Пейзаж пустыни в стиле Сальвадора Дали с парящими объектами.',
            prompt: `surreal desert landscape in the style of Salvador Dali, melting clocks draped over giant rock formations, floating spheres, twin suns in the sky, hyperrealistic, vibrant colors, oil on canvas`,
          },
          {
            title: 'Подводный город',
            description: 'Затонувший город в стиле Атлантиды, освещенный биолюминесцентными растениями.',
            prompt: `ruins of a majestic underwater city like Atlantis, glowing bioluminescent flora, schools of exotic fish swimming through ancient archways, shafts of light penetrating the deep blue water, mysterious and epic, digital painting`,
          },
        ],
      },
       {
        name: 'Продуктовый дизайн',
        prompts: [
          {
            title: 'Футуристический кроссовок',
            description: 'Концепт-дизайн кроссовок будущего для продуктовой презентации.',
            prompt: `product design concept of a futuristic sneaker, sleek aerodynamic design, translucent materials, glowing LED accents, clean studio background with soft lighting, 8k, photorealistic render, industrial design`,
          },
          {
            title: 'Минималистичные часы',
            description: 'Рекламный рендер элегантных и минималистичных наручных часов.',
            prompt: `advertisement shot of a minimalist wristwatch, clean design, matte black finish with a single silver dial, displayed on a dark marble surface, dramatic side lighting, macro shot, hyper-detailed, sophisticated`,
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
                {
                  title: 'Пост для соцсетей',
                  description: 'Написать короткий и вовлекающий пост для Instagram о запуске нового продукта.',
                  prompt: `Write a short and engaging Instagram post for the launch of a new eco-friendly water bottle. Include a call-to-action, relevant hashtags, and suggest an image to go with it.`,
                },
                {
                  title: 'Идея для email-рассылки',
                  description: 'Придумать 3 темы для еженедельной email-рассылки для фитнес-приложения.',
                  prompt: `Brainstorm 3 engaging subject lines and a brief content idea for each for a weekly newsletter for a fitness app called "FitFlow". The goal is to motivate users to complete a weekly challenge.`,
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
         {
          name: 'Деловая коммуникация',
          prompts: [
            {
              title: 'Профессиональное письмо',
              description: 'Составить вежливое письмо-напоминание клиенту об оплате счета.',
              prompt: `Draft a polite and professional follow-up email to a client regarding an overdue invoice. Mention the invoice number and due date, and offer assistance if they are facing any issues with the payment.`,
            },
            {
              title: 'Повестка для встречи',
              description: 'Создать повестку для 30-минутной командной встречи по обсуждению прогресса проекта.',
              prompt: `Create a concise agenda for a 30-minute project check-in meeting for a team of 5. Include topics like: review of last week's progress, current blockers, and goals for the next week.`,
            }
          ]
        }
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
                {
                  title: 'Кулинарный рецепт',
                  description: `Динамичное видео с приготовлением пасты в стиле 'Tasty'.`,
                  prompt: `A dynamic, top-down view video of pasta carbonara being prepared, fast-paced cuts, satisfying sounds of cooking, ingredients appearing on screen, style of a Tasty video.`,
                },
                {
                  title: 'Взрыв в замедленной съемке',
                  description: 'Эффектное видео взрыва арбуза, снятое в сверхзамедленном режиме.',
                  prompt: `An ultra slow-motion video of a watermelon exploding, captured at 1000 frames per second, detailed splash and debris, cinematic, dark background.`,
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
                {
                  title: 'Идея для визуализации данных',
                  description: 'Предложить креативный способ визуализации роста продаж компании за год.',
                  prompt: `Suggest a creative and clear way to visualize a company's sales growth over the past year for a presentation slide. The data shows a slow start, followed by rapid growth after a marketing campaign. Go beyond a simple bar chart.`,
                },
                {
                  title: 'Заключительный слайд',
                  description: 'Написать текст для заключительного слайда, который мотивирует к действию.',
                  prompt: `Write the text for a powerful concluding slide of a presentation about switching to renewable energy. It should include a memorable closing statement, a clear call-to-action, and contact information.`,
                },
            ],
        },
    ]
  }
];
