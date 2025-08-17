import React from 'react';
import Button from './Button';
import SettingsIcon from '../icons/SettingsIcon';
import { Page } from '../../types';

interface ApiKeyPromptProps {
  onNavigate: (page: Page) => void;
}

const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({ onNavigate }) => {
  return (
    <div className="bg-dark-secondary p-8 rounded-2xl shadow-lg border border-dark-tertiary/50 text-center flex flex-col items-center gap-4">
      <h2 className="text-2xl font-bold text-light-primary font-display">Требуется API-ключ</h2>
      <p className="text-light-secondary max-w-md">
        Для использования этой функции, пожалуйста, добавьте ваш Google AI API ключ на странице настроек.
      </p>
      <Button
        onClick={() => onNavigate('settings')}
        Icon={SettingsIcon}
        className="mt-2"
      >
        Перейти в Настройки
      </Button>
    </div>
  );
};

export default ApiKeyPrompt;
