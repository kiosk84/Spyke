
import React, { useState } from 'react';
import UserIcon from './icons/UserIcon';
import BurgerIcon from './icons/BurgerIcon';
import CloseIcon from './icons/CloseIcon';
import { Page } from '../types';
import { TGUser } from '../hooks/useTelegram';

interface HeaderProps {
    activePage: Page;
    onNavigate: (page: Page) => void;
    tgUser?: TGUser;
}

const Header: React.FC<HeaderProps> = ({ activePage, onNavigate, tgUser }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks: { page: Page; label: string }[] = [
        { page: 'chat', label: 'Чат' },
        { page: 'generator', label: 'Генератор' },
        { page: 'editor', label: 'Редактор' },
        { page: 'timeMachine', label: 'Машина времени' },
        { page: 'promptLibrary', label: 'Библиотека' },
        { page: 'info', label: 'Информация' },
        { page: 'history', label: 'История' },
    ];

    const getLinkClasses = (page: Page) =>
        `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activePage === page
            ? 'text-white bg-dark-tertiary'
            : 'text-light-secondary hover:text-white hover:bg-dark-tertiary/50'
        }`;

    const UserDisplay = () => (
         <div className="flex items-center gap-2 bg-dark-tertiary px-4 py-2 rounded-full text-sm font-semibold shadow-inner">
            <UserIcon className="w-5 h-5 text-brand-cyan" />
            <span className="text-white truncate max-w-[120px]">
                {tgUser?.first_name || 'Пользователь'}
            </span>
        </div>
    );

    return (
        <>
            <header className="py-3 border-b border-dark-tertiary/50 sticky top-0 z-20 bg-dark-primary/70 backdrop-blur-lg">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    {/* LEFT: Logo */}
                    <button onClick={() => onNavigate('landing')} className="flex items-center group transition-transform hover:scale-105">
                       <span className="text-xl font-bold font-display tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-magenta">
                         AI EXPERT
                       </span>
                    </button>

                    {/* RIGHT: Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-2">
                        {navLinks.map(({ page, label }) => (
                            <button key={page} onClick={() => onNavigate(page)} className={getLinkClasses(page)}>
                                {label}
                            </button>
                        ))}
                        <button onClick={() => onNavigate('user')} className="transition-transform hover:scale-105">
                          <UserDisplay />
                        </button>
                    </nav>

                    {/* RIGHT: Mobile Burger Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-light-secondary hover:text-white hover:bg-dark-tertiary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            aria-controls="mobile-menu"
                            aria-expanded={isMenuOpen}
                        >
                            <span className="sr-only">Открыть главное меню</span>
                            <BurgerIcon className="block h-6 w-6" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Side Menu */}
            <div
                className={`fixed inset-0 bg-black/60 z-30 transition-opacity duration-300 ease-in-out md:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsMenuOpen(false)}
                aria-hidden="true"
            />

            <aside
                className={`fixed top-0 right-0 h-full w-72 bg-dark-secondary shadow-lg z-40 transform transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="mobile-menu-title"
            >
                <div className="p-4 flex justify-between items-center border-b border-dark-tertiary">
                    <h2 id="mobile-menu-title" className="font-display text-xl text-white">Меню</h2>
                    <button
                        onClick={() => setIsMenuOpen(false)}
                         className="p-1 rounded-md text-light-secondary hover:text-white hover:bg-dark-tertiary focus:outline-none focus:ring-2 focus:ring-white"
                    >
                        <span className="sr-only">Закрыть меню</span>
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </div>
                <nav className="p-4 flex flex-col gap-2">
                     {navLinks.map(({ page, label }) => (
                        <button
                            key={page}
                            onClick={() => { onNavigate(page); setIsMenuOpen(false); }}
                            className={`w-full text-left ${getLinkClasses(page)}`}
                        >
                            {label}
                        </button>
                    ))}
                    <div className="pt-4 mt-2 border-t border-dark-tertiary/50 flex justify-center">
                        <button onClick={() => { onNavigate('user'); setIsMenuOpen(false); }} className="transition-transform hover:scale-105">
                          <UserDisplay />
                        </button>
                    </div>
                </nav>
            </aside>
        </>
    );
};

export default Header;