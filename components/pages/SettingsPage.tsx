import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import CheckIcon from '../icons/CheckIcon';

const API_KEY_STORAGE_ITEM = 'google-api-key';

const SettingsPage: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  useEffect(() => {
    const savedKey = localStorage.getItem(API_KEY_STORAGE_ITEM) || '';
    setApiKey(savedKey);
  }, []);
  
  const handleSave = () => {
    localStorage.setItem(API_KEY_STORAGE_ITEM, apiKey);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  return (
    <div className="bg-dark-secondary p-8 rounded-2xl shadow-lg border border-dark-tertiary/50 max-w-2xl mx-auto text-light-primary">
      <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-magenta font-display">
        Настройки
      </h1>
      
      <div className="space-y-8">
        <div>
          <label htmlFor="gemini-key" className="block text-lg font-medium text-light-primary mb-2">
            Google AI API Key
          </label>
          <p className="text-sm text-light-secondary mb-3">
            Введите ваш API ключ от Google AI Studio. Ключ будет сохранен в локальном хранилище вашего браузера и не будет передаваться никуда, кроме API Google.
          </p>
          <div className="flex items-center gap-4">
             <input
                id="gemini-key"
                type="password"
                value={apiKey}
                onChange={(e) => {
                    setApiKey(e.target.value);
                    setSaveStatus('idle');
                }}
                placeholder="Вставьте ваш API ключ..."
                className="w-full bg-dark-tertiary border border-gray-600 text-light-primary rounded-lg focus:ring-brand-cyan focus:border-brand-cyan block p-2.5 transition duration-200"
            />
            <Button
                onClick={handleSave}
                disabled={!apiKey.trim()}
                className="w-48"
            >
                {saveStatus === 'saved' ? (
                    <>
                        <CheckIcon className="w-5 h-5" /> Сохранено
                    </>
                ) : 'Сохранить ключ'}
            </Button>
          </div>
        </div>
        
        <div className="pt-4 border-t border-dark-tertiary/50">
           <h2 className="text-lg font-medium text-light-primary mb-2">Где найти API ключ?</h2>
            <ol className="list-decimal list-inside space-y-2 text-light-secondary text-sm">
                <li>Перейдите в <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-brand-cyan underline hover:text-brand-magenta">Google AI Studio</a>.</li>
                <li>Войдите в свою учетную запись Google.</li>
                <li>Нажмите кнопку "Create API key in new project".</li>
                <li>Скопируйте сгенерированный ключ и вставьте его в поле выше.</li>
            </ol>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;