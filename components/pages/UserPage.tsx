
import React, { useState, useEffect } from 'react';
import { GOOGLE_API_KEY } from '../../constants';
import Button from '../common/Button';
import KeyIcon from '../icons/KeyIcon';
import EyeIcon from '../icons/EyeIcon';
import EyeSlashIcon from '../icons/EyeSlashIcon';

const UserPage: React.FC = () => {
    const [apiKey, setApiKey] = useState('');
    const [isKeyVisible, setIsKeyVisible] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

    useEffect(() => {
        const savedKey = localStorage.getItem(GOOGLE_API_KEY);
        if (savedKey) {
            setApiKey(savedKey);
        }
    }, []);

    const handleSave = () => {
        // Basic validation - check if not empty
        if (apiKey.trim()) {
            localStorage.setItem(GOOGLE_API_KEY, apiKey.trim());
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2500);
        }
    };

    return (
        <div className="bg-dark-secondary p-8 rounded-2xl shadow-lg border border-dark-tertiary/50 max-w-2xl mx-auto text-light-primary animate-fade-in">
            <div className="flex flex-col items-center text-center mb-8">
                <div className="p-3 bg-dark-tertiary rounded-full mb-4">
                    <KeyIcon className="w-10 h-10 text-brand-cyan" />
                </div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-magenta font-display">
                    Управление API-ключами
                </h1>
                <p className="text-light-secondary mt-2">
                    Добавьте свой API-ключ от Google AI Studio для использования всех функций приложения.
                </p>
            </div>

            <div className="space-y-6">
                <div>
                    <label htmlFor="apiKeyInput" className="block text-sm font-medium text-light-secondary mb-1">
                        Ключ Google Gemini API
                    </label>
                    <div className="relative">
                        <input
                            id="apiKeyInput"
                            type={isKeyVisible ? 'text' : 'password'}
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Вставьте ваш API-ключ..."
                            className="w-full bg-dark-tertiary border border-gray-600 text-light-primary rounded-lg focus:ring-brand-cyan focus:border-brand-cyan block p-3 pr-12 transition duration-200"
                        />
                        <button
                            onClick={() => setIsKeyVisible(!isKeyVisible)}
                            className="absolute inset-y-0 right-0 px-4 text-light-secondary hover:text-white"
                            aria-label={isKeyVisible ? "Скрыть ключ" : "Показать ключ"}
                        >
                            {isKeyVisible ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </button>
                    </div>
                     <p className="text-xs text-light-secondary/70 mt-2">
                        Получить ключ можно на сайте{' '}
                        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-brand-cyan hover:underline">
                            Google AI Studio
                        </a>. Ваш ключ хранится только в вашем браузере.
                    </p>
                </div>

                <Button onClick={handleSave} className="w-full text-lg">
                    {saveStatus === 'saved' ? 'Сохранено!' : 'Сохранить ключ'}
                </Button>
            </div>
        </div>
    );
};

export default UserPage;