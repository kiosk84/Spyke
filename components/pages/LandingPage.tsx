
import React from 'react';
import { Page } from '../../types';
import RobotIcon from '../icons/RobotIcon';
import ImageIcon from '../icons/ImageIcon';
import MagicWandIcon from '../icons/MagicWandIcon';
import ClockIcon from '../icons/ClockIcon';

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
    className="bg-dark-secondary/50 backdrop-blur-md border border-dark-tertiary/50 p-8 rounded-2xl w-full max-w-sm text-left flex flex-col items-start transition-all duration-300 transform hover:scale-105 hover:border-brand-cyan/50 hover:shadow-glow-cyan focus:outline-none focus:ring-2 focus:ring-brand-cyan"
  >
    <div className="p-3 bg-dark-tertiary rounded-full mb-4">
      <Icon className="w-8 h-8 text-brand-cyan" />
    </div>
    <h2 className="text-2xl font-bold font-display text-white mb-2">{title}</h2>
    <p className="text-light-secondary flex-grow">{description}</p>
    <span className="mt-6 text-brand-cyan font-semibold">Перейти →</span>
  </button>
);

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="text-center animate-fade-in p-4">
      <h1 className="text-5xl md:text-6xl font-black font-display tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-magenta mb-4">
        AI EXPERT
      </h1>
      <p className="text-lg md:text-xl text-light-secondary mb-12 max-w-2xl mx-auto">
        Ваш универсальный инструмент для творчества с ИИ. Выберите, с чего хотите начать.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 justify-items-center">
        <FeatureCard
          title="Чат с AI"
          description="Задавайте вопросы, получайте помощь и общайтесь с продвинутым AI-ассистентом."
          Icon={RobotIcon}
          onClick={() => onNavigate('chat')}
        />
        <FeatureCard
          title="Генератор Изображений"
          description="Создавайте уникальные изображения из текстовых описаний с помощью передовых моделей."
          Icon={ImageIcon}
          onClick={() => onNavigate('generator')}
        />
        <FeatureCard
          title="Редактор Изображений"
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
      </div>
    </div>
  );
};

export default LandingPage;