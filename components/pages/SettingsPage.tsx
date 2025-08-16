import React, { useState } from 'react';
import Button from '../common/Button';

const SettingsPage: React.FC = () => {
  const [otherApiKey, setOtherApiKey] = useState('');

  return (
    <div className="bg-dark-secondary p-8 rounded-2xl shadow-lg border border-dark-tertiary/50 max-w-2xl mx-auto text-light-primary">
      <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-magenta font-display">
        Настройки API Ключей
      </h1>
      
      <div className="space-y-8">
        {/* Google Gemini API Key Section */}
        <div>
          <label htmlFor="gemini-key" className="block text-lg font-medium text-light-primary mb-2">
            Google Gemini API Key
          </label>
          <p className="text-sm text-light-secondary mb-2">
            Ваш ключ Google Gemini API предварительно настроен и надежно управляется на стороне сервера. Вам не нужно вводить его здесь.
          </p>
          <input
            id="gemini-key"
            type="text"
            disabled
            placeholder="Управляется сервером"
            className="w-full bg-dark-tertiary border border-gray-600 text-gray-400 rounded-lg p-2.5 cursor-not-allowed"
          />
        </div>

        {/* Other API Key Section */}
        <div>
          <label htmlFor="other-api-key" className="block text-lg font-medium text-light-primary mb-2">
            Ключ другого сервиса (например, OpenAI)
          </label>
           <p className="text-sm text-light-secondary mb-2">
            Эта функция будет добавлена в будущем для поддержки других моделей генерации.
          </p>
          <input
            id="other-api-key"
            type="password"
            value={otherApiKey}
            onChange={(e) => setOtherApiKey(e.target.value)}
            placeholder="Введите ваш API ключ..."
            className="w-full bg-dark-tertiary border border-gray-600 text-light-primary rounded-lg focus:ring-brand-cyan focus:border-brand-cyan block p-2.5 transition duration-200"
          />
        </div>
        
        <div className="pt-4">
            <Button
                onClick={() => alert('Настройки сохранены (демо)')}
                disabled={!otherApiKey.trim()}
                className="w-full"
            >
                Сохранить настройки
            </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
