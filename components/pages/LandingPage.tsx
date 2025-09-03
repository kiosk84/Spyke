

import React from 'react';
import { Page } from '../../types';
import RobotIcon from '../icons/RobotIcon';
import ImageIcon from '../icons/ImageIcon';
import MagicWandIcon from '../icons/MagicWandIcon';
import ClockIcon from '../icons/ClockIcon';
import BookOpenIcon from '../icons/BookOpenIcon';

interface LandingPageProps {
  onNavigate: (page: Page) => void;
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

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="text-center animate-fade-in p-4">
      <h1 className="text-5xl md:text-6xl font-black font-display tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-magenta mb-4">
        AI EXPERT
      </h1>
      <p className="text-lg md:text-xl text-light-secondary mb-4 max-w-3xl mx-auto">
        Откройте мир AI: общайтесь в чате, создавайте изображения, редактируйте фото и исследуйте огромную библиотеку готовых промптов.
      </p>
      <div className="bg-dark-secondary/40 border border-brand-cyan/20 rounded-2xl p-4 max-w-2xl mx-auto mb-12 text-center backdrop-blur-sm">
        <p className="text-md text-light-secondary/90">
          Прежде чем начать, получите бесплатный API-ключ в <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-brand-cyan font-semibold hover:underline">Google AI Studio</a> и добавьте его в 
          <button onClick={() => onNavigate('user')} className="text-brand-cyan font-semibold hover:underline ml-1">профиле пользователя</button>. Это откроет все возможности EXPERT!
        </p>
      </div>
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