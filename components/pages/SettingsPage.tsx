
import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import CheckIcon from '../icons/CheckIcon';
import { AiProvider } from '../../types';
import { AI_PROVIDER_STORAGE_ITEM } from '../../services/aiService';
import { API_KEY_STORAGE_ITEM } from '../../services/geminiService';


const SettingsPage: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [aiProvider, setAiProvider] = useState<AiProvider>('google');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  useEffect(() => {
    setApiKey(localStorage.getItem(API_KEY_STORAGE_ITEM) || '');
    
    const savedProvider = localStorage.getItem(AI_PROVIDER_STORAGE_ITEM) as AiProvider;
    if (savedProvider) {
      setAiProvider(savedProvider);
    }
  }, []);
  
  const handleSaveSettings = () => {
    localStorage.setItem(API_KEY_STORAGE_ITEM, apiKey);
    
    // Trigger storage event for other tabs
    window.dispatchEvent(new Event('storage'));

    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };
  
  const handleProviderChange = (provider: AiProvider) => {
    setAiProvider(provider);
    localStorage.setItem(AI_PROVIDER_STORAGE_ITEM, provider);
    window.dispatchEvent(new Event('storage'));
  }

  return (
    <div className="bg-dark-secondary p-8 rounded-2xl shadow-lg border border-dark-tertiary/50 max-w-2xl mx-auto text-light-primary">
      <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-magenta font-display">
        Настройки
      </h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="block text-lg font-medium text-light-primary mb-2">
            Источник AI-модели
          </h2>
          <p className="text-sm text-light-secondary mb-4">
            Выберите, какой сервис использовать для чата и улучшения промптов. Генерация изображений всегда происходит через Google AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => handleProviderChange('google')}
              className={`flex-1 p-4 rounded-lg border-2 text-left transition-all ${aiProvider === 'google' ? 'border-brand-cyan bg-brand-cyan/10' : 'border-dark-tertiary hover:border-gray-600'}`}
            >
              <h3 className="font-bold text-white">Google AI (Облако)</h3>
              <p className="text-xs text-light-secondary mt-1">Использует мощные модели Gemini и Imagen. Требует API-ключ. Высочайшее качество.</p>
            </button>
            <button
              onClick={() => handleProviderChange('ollama')}
              className={`flex-1 p-4 rounded-lg border-2 text-left transition-all ${aiProvider === 'ollama' ? 'border-brand-cyan bg-brand-cyan/10' : 'border-dark-tertiary hover:border-gray-600'}`}
            >
              <h3 className="font-bold text-white">Ollama (Локально)</h3>
              <p className="text-xs text-light-secondary mt-1">Использует модели, запущенные на вашем ПК. Быстро и приватно.</p>
            </button>
          </div>
        </div>
        
        {aiProvider === 'google' && (
          <div className="animate-fade-in">
            <label htmlFor="gemini-key" className="block text-lg font-medium text-light-primary mb-2">
              Google AI API Key
            </label>
            <p className="text-sm text-light-secondary mb-3">
              Ключ будет сохранен в локальном хранилище вашего браузера.
            </p>
            <input
                id="gemini-key"
                type="password"
                value={apiKey}
                onChange={(e) => { setApiKey(e.target.value); setSaveStatus('idle'); }}
                placeholder="Вставьте ваш API ключ..."
                className="w-full bg-dark-tertiary border border-gray-600 text-light-primary rounded-lg focus:ring-brand-cyan focus:border-brand-cyan block p-2.5 transition duration-200"
            />
             <div className="mt-4 text-xs text-light-secondary">
                Где найти ключ? Перейдите в <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-brand-cyan underline hover:text-brand-magenta">Google AI Studio</a>, нажмите "Create API key".
            </div>
          </div>
        )}

        {aiProvider === 'ollama' && (
            <div className="animate-fade-in space-y-4 p-4 bg-dark-tertiary rounded-lg border border-brand-cyan/20">
              <h3 className="font-bold text-white">Ollama (Локально) Настроено</h3>
              <p className="text-sm text-light-secondary">
                  Приложение предварительно настроено для подключения к вашему локальному серверу Ollama через специальный онлайн-мост.
              </p>
              <ul className="list-disc list-inside text-xs text-light-secondary space-y-1 pl-2">
                  <li>Убедитесь, что ваш <strong className="text-white">сервер Ollama</strong> запущен на вашем ПК.</li>
                  <li>Убедитесь, что <strong className="text-white">API-мост</strong> из папки <code>server</code> также запущен.</li>
                  <li>Приложение будет использовать модель по умолчанию (например, <code>llama3</code>) с вашего сервера.</li>
              </ul>
              <p className="text-xs text-light-secondary pt-2">
                  Никаких дополнительных настроек в приложении не требуется.
              </p>
            </div>
        )}

        <div className="pt-8 mt-8 border-t border-dark-tertiary/50">
           <Button
                onClick={handleSaveSettings}
                className="w-full"
                disabled={aiProvider === 'ollama'}
            >
                {saveStatus === 'saved' ? (
                    <>
                        <CheckIcon className="w-5 h-5" /> Сохранено
                    </>
                ) : 'Сохранить настройки'}
            </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;