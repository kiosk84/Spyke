import React from 'react';

const InfoPage: React.FC = () => {
  return (
    <div className="bg-dark-secondary p-8 rounded-2xl shadow-lg border border-dark-tertiary/50 max-w-4xl mx-auto text-light-primary">
      <h1 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-magenta font-display">
        О проекте «AI EXPERT»
      </h1>
      <div className="space-y-6 text-light-secondary">
        <p className="text-lg">
          Добро пожаловать в «AI EXPERT» — вашу персональную творческую студию на базе искусственного интеллекта. Это приложение создано, чтобы помочь вам легко и быстро воплощать самые смелые визуальные идеи в жизнь, используя мощь передовых моделей от Google.
        </p>
        
        <h2 className="text-2xl font-semibold text-light-primary pt-4 font-display">Наши Инструменты</h2>
        
        <div className="space-y-4">
            <div>
                <h3 className="text-xl font-bold text-light-primary">Генератор Изображений</h3>
                <p>Превратите любую идею в уникальное изображение. Наш генератор работает в два этапа:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li><strong>Из текста:</strong> Опишите вашу концепцию на русском, и AI (Gemini 2.5 Flash) создаст детализированный промпт на английском.</li>
                    <li><strong>Из изображения:</strong> Загрузите картинку, и AI проанализирует её, создав профессиональный промпт для воссоздания стиля.</li>
                    <li><strong>Визуализация:</strong> Модель Imagen 4.0 сгенерирует высококачественное изображение на основе полученного промпта.</li>
                </ul>
            </div>

            <div>
                <h3 className="text-xl font-bold text-light-primary">AI Редактор</h3>
                <p>Загрузите фотографию и преобразите её! Редактор позволяет:</p>
                 <ul className="list-disc list-inside mt-2 space-y-1">
                    <li><strong>Применять готовые стили:</strong> Превратите фото в аватар, картину маслом, постер в стиле GTA или кадр из аниме одним нажатием.</li>
                    <li><strong>Редактировать текстом:</strong> Давайте команды на естественном языке («сделай волосы синими», «добавь неоновые огни»), и AI (Gemini Flash Image Preview) будет итеративно изменять изображение.</li>
                    <li><strong>Сравнивать результат:</strong> Используйте удобный слайдер для сравнения «до» и «после».</li>
                </ul>
            </div>

            <div>
                <h3 className="text-xl font-bold text-light-primary">Машина Времени</h3>
                <p>Отправьтесь в путешествие по прошлому! Загрузите свой портрет и посмотрите, как бы вы выглядели в разные десятилетия — от винтажных 50-х до ярких 2000-х.</p>
            </div>
            
            <div>
                <h3 className="text-xl font-bold text-light-primary">Чат с AI</h3>
                <p>Наш интеллектуальный ассистент на базе Gemini всегда готов помочь. Задавайте вопросы, просите совета, ищите вдохновение или просто общайтесь.</p>
            </div>
        </div>

        <p className="pt-4 text-lg">
          «EXPERT» — это ваш проводник в мир безграничных возможностей генеративного искусства. Экспериментируйте, творите и открывайте новые горизонты!
        </p>
      </div>
    </div>
  );
};

export default InfoPage;