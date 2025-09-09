import React from 'react';
import { Page } from '../../types';
import RobotIcon from '../icons/RobotIcon';
import ImageIcon from '../icons/ImageIcon';
import MagicWandIcon from '../icons/MagicWandIcon';
import ClockIcon from '../icons/ClockIcon';
import BookOpenIcon from '../icons/BookOpenIcon';
import KeyIcon from '../icons/KeyIcon';

interface LandingPageProps {
  onNavigate: (page: Page) => void;
  isApiKeySet: boolean;
}

const FeatureCard: React.FC<{
  title: string;
  description: string;
  Icon: React.ElementType;
  onClick: () => void;
}> = ({ title, description, Icon, onClick }) => (
  <button
    onClick={onClick}
    className="bg-dark-secondary/50 backdrop-blur-md border border-dark-tertiary/50 p-6 rounded-2xl w-full text-left flex flex-col items-start transition-all duration-300 transform hover:scale-105 hover:border-brand-cyan/50 hover:shadow-glow-cyan focus:outline-none focus:ring-2 focus:ring-brand-cyan"
  >
    <div className="p-3 bg-dark-tertiary rounded-full mb-4">
      <Icon className="w-8 h-8 text-brand-cyan" />
    </div>
    <h2 className="text-xl font-bold font-display text-white mb-2">{title}</h2>
    <p className="text-light-secondary flex-grow text-sm">{description}</p>
    <span className="mt-4 text-brand-cyan font-semibold text-sm">Перейти →</span>
  </button>
);

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, isApiKeySet }) => {
  return (
    <div className="text-center animate-fade-in p-4 w-full">
        {!isApiKeySet && (
        <div className="bg-yellow-900/50 border border-yellow-500 text-yellow-300 p-4 rounded-lg text-center mb-8 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4">
            <KeyIcon className="w-8 h-8 flex-shrink-0" />
            <div className="text-left">
                <h3 className="font-bold">Требуется API-ключ Google</h3>
                <p className="text-sm text-yellow-400/80">Для использования функций генерации и чата необходимо добавить ваш собственный API-ключ на странице пользователя.</p>
            </div>
          <button
            onClick={() => onNavigate('user')}
            className="bg-yellow-500 text-dark-primary font-bold py-2 px-4 rounded-lg hover:bg-yellow-400 transition-colors w-full sm:w-auto flex-shrink-0"
          >
            Добавить ключ
          </button>
        </div>
      )}
      <h1 className="text-5xl md:text-6xl font-black font-display tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-magenta mb-4">
        AI EXPERT
      </h1>
      <p className="text-lg md:text-xl text-light-secondary mb-12 max-w-3xl mx-auto">
        Откройте мир AI: общайтесь в чате, создавайте изображения, редактируйте фото и исследуйте огромную библиотеку готовых промптов.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 justify-items-center">
        <FeatureCard
          title="Чат с AI"
          description="Задавайте вопросы, получайте помощь и общайтесь с продвинутым AI-ассистентом."
          Icon={RobotIcon}
          onClick={() => onNavigate('chat')}
        />
        <FeatureCard
          title="Генератор"
          description="Создавайте уникальные изображения из текстовых описаний с помощью передовых моделей."
          Icon={ImageIcon}
          onClick={() => onNavigate('generator')}
        />
        <FeatureCard
          title="Редактор"
          description="Редактируйте и стилизуйте ваши фотографии, применяя креативные AI-фильтры."
          Icon={MagicWandIcon}
          onClick={() => onNavigate('editor')}
        />
         <FeatureCard
          title="Машина времени"
          description="Отправьте своё фото в прошлое и посмотрите, как бы вы выглядели в разные десятилетия."
          Icon={ClockIcon}
          onClick={() => onNavigate('timeMachine')}
        />
        <FeatureCard
          title="Библиотека"
          description="Используйте готовые профессиональные промпты для любых задач и вдохновляйтесь."
          Icon={BookOpenIcon}
          onClick={() => onNavigate('promptLibrary')}
        />
      </div>
    </div>
  );
};

export default LandingPage;