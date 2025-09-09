import React, { useState, useEffect } from 'react';
import { USER_BALANCE_KEY, DEFAULT_BALANCE, GOOGLE_API_KEY_KEY } from '../../constants';
import Button from '../common/Button';
import CoinIcon from '../icons/CoinIcon';
import RefreshIcon from '../icons/RefreshIcon';
import KeyIcon from '../icons/KeyIcon';
import EyeIcon from '../icons/EyeIcon';
import EyeSlashIcon from '../icons/EyeSlashIcon';
import TrashIcon from '../icons/TrashIcon';

interface UserPageProps {
    onBalanceReset: () => void;
    onApiKeyUpdate: () => void;
}

const UserPage: React.FC<UserPageProps> = ({ onBalanceReset, onApiKeyUpdate }) => {
    const [balance, setBalance] = useState<number | null>(null);
    const [apiKey, setApiKey] = useState('');
    const [isKeyVisible, setIsKeyVisible] = useState(false);

    useEffect(() => {
        const savedBalance = localStorage.getItem(USER_BALANCE_KEY);
        setBalance(savedBalance ? parseInt(savedBalance, 10) : DEFAULT_BALANCE);
        const savedApiKey = localStorage.getItem(GOOGLE_API_KEY_KEY);
        setApiKey(savedApiKey || '');
    }, []);

    const handleResetBalance = () => {
        if (window.confirm(`Вы уверены, что хотите сбросить баланс до ${DEFAULT_BALANCE}?`)) {
            onBalanceReset();
            setBalance(DEFAULT_BALANCE);
        }
    };

    const handleSaveKey = () => {
        localStorage.setItem(GOOGLE_API_KEY_KEY, apiKey.trim());
        onApiKeyUpdate();
        alert('API-ключ сохранен!');
    };

    const handleDeleteKey = () => {
        if (window.confirm('Вы уверены, что хотите удалить API-ключ?')) {
            localStorage.removeItem(GOOGLE_API_KEY_KEY);
            setApiKey('');
            onApiKeyUpdate();
        }
    };

    return (
        <div className="bg-dark-secondary p-8 rounded-2xl shadow-lg border border-dark-tertiary/50 max-w-2xl mx-auto text-light-primary animate-fade-in space-y-10">
            {/* API Key Management Section */}
            <div>
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="p-3 bg-dark-tertiary rounded-full mb-4">
                        <KeyIcon className="w-10 h-10 text-brand-magenta" />
                    </div>
                    <h1 className="text-3xl font-bold font-display">
                        Управление API Ключом
                    </h1>
                    <p className="text-light-secondary mt-2">
                        Добавьте ваш API-ключ от <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-brand-cyan hover:underline">Google AI Studio</a> для доступа ко всем функциям.
                    </p>
                </div>
                <div className="space-y-4">
                    <div className="relative">
                        <input
                            type={isKeyVisible ? 'text' : 'password'}
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Введите ваш Google AI API ключ"
                            className="w-full bg-dark-tertiary border border-gray-600 text-light-primary rounded-lg focus:ring-brand-cyan focus:border-brand-cyan block p-3 pr-12 transition duration-200"
                        />
                        <button
                            onClick={() => setIsKeyVisible(!isKeyVisible)}
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-light-secondary hover:text-white"
                            aria-label={isKeyVisible ? 'Скрыть ключ' : 'Показать ключ'}
                        >
                            {isKeyVisible ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </button>
                    </div>
                    <div className="flex gap-4">
                        <Button onClick={handleSaveKey} disabled={!apiKey.trim()} className="flex-grow">
                            Сохранить ключ
                        </Button>
                        <Button onClick={handleDeleteKey} variant="secondary" disabled={!localStorage.getItem(GOOGLE_API_KEY_KEY)} title="Удалить ключ">
                            <TrashIcon className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Separator */}
            <div className="border-t border-dark-tertiary/50"></div>

            {/* Balance Management Section */}
            <div>
                 <div className="flex flex-col items-center text-center mb-8">
                    <div className="p-3 bg-dark-tertiary rounded-full mb-4">
                        <CoinIcon className="w-10 h-10 text-brand-cyan" />
                    </div>
                    <h1 className="text-3xl font-bold font-display">
                        Управление Балансом
                    </h1>
                    <p className="text-light-secondary mt-2">
                        Управляйте своим балансом кредитов для генерации.
                    </p>
                </div>
                <div className="bg-dark-tertiary p-4 rounded-lg space-y-4">
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-light-secondary">Текущий баланс</span>
                            <div className="flex items-center gap-2 mt-1">
                                <CoinIcon className="w-6 h-6 text-yellow-400" />
                                <span className="text-2xl font-bold text-white">{balance !== null ? balance : '...'}</span>
                            </div>
                        </div>
                        <Button onClick={handleResetBalance} variant="secondary" title="Сбросить баланс до начального">
                            <RefreshIcon className="w-5 h-5" />
                        </Button>
                    </div>
                    <Button
                        onClick={() => window.open('https://t.me/Expert_system_robot', '_blank')}
                        variant="primary"
                        title="Пополнить баланс"
                        Icon={CoinIcon}
                        className="w-full"
                    >
                        Пополнить баланс
                    </Button>
                </div>
            </div>

        </div>
    );
};

export default UserPage;