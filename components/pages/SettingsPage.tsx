import React, { useState, useEffect } from 'react';
import SettingsIcon from '../icons/SettingsIcon';
import SignalIcon from '../icons/SignalIcon';
import Button from '../common/Button';
import { AiProvider } from '../../types';
import { AI_PROVIDER_KEY, OLLAMA_URL_KEY, OLLAMA_MODEL_KEY, OLLAMA_PROXY_URL_KEY } from '../../constants';
import * as ollamaService from '../../services/ollamaService';

const SettingsPage: React.FC = () => {
    const [provider, setProvider] = useState<AiProvider>('google');
    const [ollamaUrl, setOllamaUrl] = useState('');
    const [ollamaModel, setOllamaModel] = useState('');
    const [proxyUrl, setProxyUrl] = useState('');
    
    const [isTesting, setIsTesting] = useState(false);
    const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

    useEffect(() => {
        // Загрузка настроек из localStorage при монтировании компонента
        const savedProvider = localStorage.getItem(AI_PROVIDER_KEY) as AiProvider | null;
        setProvider(savedProvider || 'google');
        setOllamaUrl(localStorage.getItem(OLLAMA_URL_KEY) || '');
        setOllamaModel(localStorage.getItem(OLLAMA_MODEL_KEY) || '');
        setProxyUrl(localStorage.getItem(OLLAMA_PROXY_URL_KEY) || '');
    }, []);

    const handleSave = () => {
        localStorage.setItem(AI_PROVIDER_KEY, provider);
        localStorage.setItem(OLLAMA_URL_KEY, ollamaUrl);
        localStorage.setItem(OLLAMA_MODEL_KEY, ollamaModel);
        localStorage.setItem(OLLAMA_PROXY_URL_KEY, proxyUrl);
        alert('Настройки сохранены!');
    };

    const handleTestConnection = async () => {
        if (!ollamaUrl || !proxyUrl) {
            setTestResult({ success: false, message: 'Пожалуйста, заполните URL сервера Ollama и URL API-моста.'});
            return;
        }
        setIsTesting(true);
        setTestResult(null);
        const result = await ollamaService.checkConnection(ollamaUrl, proxyUrl);
        setTestResult(result);
        setIsTesting(false);
    };
    
    const renderTestResult = () => {
        if (!testResult) return null;
        const baseClasses = 'p-3 mt-4 rounded-lg text-sm text-center';
        if (testResult.success) {
            return <div className={`${baseClasses} bg-green-900/50 border border-green-500 text-green-300`}>{testResult.message}</div>
        }
        return <div className={`${baseClasses} bg-red-900/50 border border-red-500 text-red-300`}>{testResult.message}</div>
    }

    const InputField: React.FC<{label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder: string}> = ({label, value, onChange, placeholder}) => (
        <div>
            <label className="block text-sm font-medium text-light-secondary mb-1">{label}</label>
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-dark-tertiary border border-gray-600 text-light-primary rounded-lg focus:ring-brand-cyan focus:border-brand-cyan block p-2.5 transition duration-200"
            />
        </div>
    );

    return (
        <div className="bg-dark-secondary p-8 rounded-2xl shadow-lg border border-dark-tertiary/50 max-w-2xl mx-auto text-light-primary">
            <div className="flex flex-col items-center text-center mb-8">
                <div className="p-3 bg-dark-tertiary rounded-full mb-4">
                    <SettingsIcon className="w-10 h-10 text-brand-cyan" />
                </div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-magenta font-display">
                    Настройки AI-Провайдера
                </h1>
                <p className="text-light-secondary mt-2">Выберите и настройте сервис, который будет использоваться для чата и улучшения промптов.</p>
            </div>

            {/* Provider Selector */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-dark-tertiary mb-6">
                <button
                    onClick={() => setProvider('google')}
                    className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${provider === 'google' ? 'bg-brand-cyan text-white shadow-md' : 'text-light-secondary hover:bg-dark-primary/50'}`}
                >
                    Google AI
                </button>
                <button
                    onClick={() => setProvider('ollama')}
                    className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${provider === 'ollama' ? 'bg-brand-cyan text-white shadow-md' : 'text-light-secondary hover:bg-dark-primary/50'}`}
                >
                    Локальный AI (Ollama)
                </button>
            </div>

            {/* Settings Content */}
            <div className="space-y-6">
                {provider === 'google' && (
                    <div className="p-4 rounded-lg bg-dark-tertiary border border-dark-tertiary/50 text-center animate-fade-in">
                        <h2 className="text-xl font-bold text-light-primary font-display mb-2">Google AI (Gemini & Imagen)</h2>
                        <p className="text-light-secondary">
                            Вся конфигурация происходит автоматически. Приложение использует API Google, ключ для которого безопасно управляется на стороне сервера. Никаких дополнительных действий не требуется.
                        </p>
                    </div>
                )}
                {provider === 'ollama' && (
                    <div className="space-y-4 animate-fade-in">
                        <InputField
                            label="URL сервера Ollama"
                            value={ollamaUrl}
                            onChange={(e) => setOllamaUrl(e.target.value)}
                            placeholder="http://localhost:11434"
                        />
                         <InputField
                            label="Имя модели"
                            value={ollamaModel}
                            onChange={(e) => setOllamaModel(e.target.value)}
                            placeholder="gemma:2b"
                        />
                        <InputField
                            label="URL API-моста (Ngrok Tunnel)"
                            value={proxyUrl}
                            onChange={(e) => setProxyUrl(e.target.value)}
                            placeholder="https://your-tunnel.ngrok-free.app"
                        />
                        <p className="text-xs text-light-secondary/70">
                            API-мост необходим для обхода ограничений CORS. Убедитесь, что ваш локальный сервер-мост и туннель запущены (см. `README.md`).
                        </p>
                        <Button
                            onClick={handleTestConnection}
                            isLoading={isTesting}
                            variant="secondary"
                            className="w-full"
                            Icon={SignalIcon}
                        >
                            Проверить соединение
                        </Button>
                        {renderTestResult()}
                    </div>
                )}
                 <Button onClick={handleSave} className="w-full text-lg">
                    Сохранить настройки
                </Button>
            </div>
        </div>
    );
};

export default SettingsPage;