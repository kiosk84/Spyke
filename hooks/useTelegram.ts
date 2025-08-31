import { useState, useEffect } from 'react';

// Расширяем глобальный интерфейс Window, чтобы TypeScript знал о Telegram.WebApp
declare global {
  interface Window {
    Telegram: {
      WebApp: any;
    };
  }
}

export interface TGUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code: string;
}

/**
 * Хук для работы с Telegram Web App API.
 * Возвращает объект `tg` и данные пользователя `user`.
 */
export const useTelegram = () => {
    const [tg, setTg] = useState<any>(null);
    const [user, setUser] = useState<TGUser | undefined>(undefined);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.Telegram) {
            const webApp = window.Telegram.WebApp;
            setTg(webApp);
            if (webApp.initDataUnsafe?.user) {
                setUser(webApp.initDataUnsafe.user);
            }
        }
    }, []);

    return {
        tg,
        user,
        webApp: tg, // псевдоним для удобства
    };
};
