import React, { useState, useEffect } from 'react';
import { USER_BALANCE_KEY, DEFAULT_BALANCE } from '../../constants';
import Button from '../common/Button';
import CoinIcon from '../icons/CoinIcon';
import RefreshIcon from '../icons/RefreshIcon';

interface UserPageProps {
    onBalanceReset: () => void;
}

const UserPage: React.FC<UserPageProps> = ({ onBalanceReset }) => {
    const [balance, setBalance] = useState<number | null>(null);

    useEffect(() => {
        const savedBalance = localStorage.getItem(USER_BALANCE_KEY);
        setBalance(savedBalance ? parseInt(savedBalance, 10) : DEFAULT_BALANCE);
    }, []);

    const handleResetBalance = () => {
        if (window.confirm(`Вы уверены, что хотите сбросить баланс до ${DEFAULT_BALANCE}?`)) {
            onBalanceReset();
            setBalance(DEFAULT_BALANCE);
        }
    };

    return (
        <div className="bg-dark-secondary p-8 rounded-2xl shadow-lg border border-dark-tertiary/50 max-w-2xl mx-auto text-light-primary animate-fade-in">
            <div className="flex flex-col items-center text-center mb-8">
                <div className="p-3 bg-dark-tertiary rounded-full mb-4">
                    <CoinIcon className="w-10 h-10 text-brand-cyan" />
                </div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-magenta font-display">
                    Управление Балансом
                </h1>
                <p className="text-light-secondary mt-2">
                    Управляйте своим балансом кредитов для генерации.
                </p>
            </div>

            <div className="space-y-6">
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