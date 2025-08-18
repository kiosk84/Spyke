
import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import CheckIcon from '../icons/CheckIcon';
import { AiProvider } from '../../types';
import { AI_PROVIDER_STORAGE_ITEM } from '../../services/aiService';
import { API_KEY_STORAGE_ITEM } from '../../services/geminiService';
import { OLLAMA_URL_STORAGE_ITEM, OLLAMA_MODEL_STORAGE_ITEM } from '../../services/ollamaService';


const SettingsPage: React.FC = () => {
  // Google State
  const [apiKey, setApiKey] = useState('');

  // Ollama State
  const [ollamaUrl, setOllamaUrl] = useState('');
  const [ollamaModel, setOllamaModel] = useState('');
  
  // General State
  const [aiProvider, setAiProvider] = useState<AiProvider>('ollama');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  useEffect(() => {
    // Load Google settings
    setApiKey(localStorage.getItem(API_KEY_STORAGE_ITEM) || '');
    
    // Load Ollama settings with user-provided defaults
    setOllamaUrl(localStorage.getItem(OLLAMA_URL_STORAGE_ITEM) || 'http://192.168.0.105:11434');
    setOllamaModel(localStorage.getItem(OLLAMA_MODEL_STORAGE_ITEM) || 'gemma3n');

    // Load provider
    const savedProvider = localStorage.getItem(AI_PROVIDER_STORAGE_ITEM) as AiProvider;
    if (savedProvider) {
      setAiProvider(savedProvider);
    }
  }, []);
  
  const handleSaveSettings = () => {
    // Save settings based on the active provider
    if (aiProvider === 'google') {
        localStorage.setItem(API_KEY_STORAGE_ITEM, apiKey);
    } else { // Ollama
        const cleanedUrl = ollamaUrl.trim().replace(/\/$/, ''); // Remove trailing slashes
        localStorage.setItem(OLLAMA_URL_STORAGE_ITEM, cleanedUrl);
        localStorage.setItem(OLLAMA_MODEL_STORAGE_ITEM, ollamaModel.trim());
    }
    
    // Trigger storage event for other tabs to update their state
    window.dispatchEvent(new Event('storage'));

    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };
  
  const handleProviderChange = (provider: AiProvider) => {
    setAiProvider(provider);
    localStorage.setItem(AI_PROVIDER_STORAGE_ITEM, provider);
    window.dispatchEvent(new Event('storage'));
    setSaveStatus('idle'); // Reset save status on provider change
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
             <div className="animate-fade-in space-y-6">
                <div>
                    <h3 className="text-lg font-medium text-light-primary mb-3">Настройка Ollama</h3>
                    <div className="space-y-3 p-4 bg-dark-tertiary rounded-lg border border-brand-cyan/20">
                        <p className="text-sm text-light-secondary">
                            Приложение использует онлайн-мост для связи с вашим локальным сервером Ollama. Укажите адрес вашего сервера и имя модели.
                        </p>
                        <ul className="list-disc list-inside text-xs text-light-secondary space-y-1 pl-2">
                            <li>Убедитесь, что ваш <strong className="text-white">сервер Ollama</strong> запущен.</li>
                            <li>Убедитесь, что <strong className="text-white">API-мост</strong> (`server`) и туннель `ngrok` запущены.</li>
                        </ul>
                    </div>
                </div>

                <div>
                    <label htmlFor="ollama-url" className="block text-sm font-medium text-light-primary mb-2">
                      URL вашего сервера Ollama
                    </label>
                    <input
                        id="ollama-url"
                        type="text"
                        value={ollamaUrl}
                        onChange={(e) => { setOllamaUrl(e.target.value); setSaveStatus('idle'); }}
                        placeholder="http://192.168.0.105:11434"
                        className="w-full bg-dark-tertiary border border-gray-600 text-light-primary rounded-lg focus:ring-brand-cyan focus:border-brand-cyan block p-2.5 transition duration-200"
                    />
                    <p className="mt-2 text-xs text-light-secondary/80">
                      Укажите базовый URL, например: <code>http://192.168.0.105:11434</code>. Не добавляйте <code>/api/...</code> в конец.
                    </p>
                </div>

                <div>
                    <label htmlFor="ollama-model" className="block text-sm font-medium text-light-primary mb-2">
                      Имя модели
                    </label>
                    <input
                        id="ollama-model"
                        type="text"
                        value={ollamaModel}
                        onChange={(e) => { setOllamaModel(e.target.value); setSaveStatus('idle'); }}
                        placeholder="gemma3n"
                        className="w-full bg-dark-tertiary border border-gray-600 text-light-primary rounded-lg focus:ring-brand-cyan focus:border-brand-cyan block p-2.5 transition duration-200"
                    />
                </div>
            </div>
        )}

        <div className="pt-8 mt-8 border-t border-dark-tertiary/50">
           <Button
                onClick={handleSaveSettings}
                className="w-full"
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