import React, { useState } from 'react';
import SparkleIcon from './icons/SparkleIcon';
import CoinIcon from './icons/CoinIcon';
import BurgerIcon from './icons/BurgerIcon';
import CloseIcon from './icons/CloseIcon';
import SettingsIcon from './icons/SettingsIcon';
import { Page } from '../types';

interface NavItemsProps {
    activePage: Page;
    onNavigate: (page: Page) => void;
    onLinkClick?: () => void;
}

const NavItems: React.FC<NavItemsProps> = ({ activePage, onNavigate, onLinkClick }) => {
    const navLinks: { page: Page; label: string }[] = [
        { page: 'info', label: 'Информация' },
        { page: 'history', label: 'История' },
        { page: 'settings', label: 'Настройки' }
    ];

    const getLinkClasses = (page: Page) => 
        `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activePage === page 
            ? 'text-white bg-dark-tertiary' 
            : 'text-light-secondary hover:text-white'
        }`;

    return (
        <>
            {navLinks.map(({ page, label }) => (
                 <button key={page} onClick={() => { onNavigate(page); onLinkClick?.(); }} className={getLinkClasses(page)}>
                    {label}
                </button>
            ))}
            <div className="flex items-center gap-2 bg-dark-tertiary px-4 py-2 rounded-full text-sm font-semibold shadow-inner">
                <CoinIcon className="w-5 h-5 text-yellow-400" />
                <span className="text-white">100</span>
                <span className="text-light-secondary">монет</span>
            </div>
        </>
    );
};


interface HeaderProps {
    activePage: Page;
    onNavigate: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ activePage, onNavigate }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="py-4 border-b border-dark-tertiary/50 sticky top-0 z-20 bg-dark-primary/70 backdrop-blur-lg">
            <div className="container mx-auto px-4 flex items-center justify-between">
                <button onClick={() => onNavigate('generator')} className="flex items-center gap-3 group">
                    <SparkleIcon className="w-8 h-8 text-brand-cyan group-hover:scale-110 transition-transform" />
                    <div>
                         <h1 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-magenta font-display">
                            Искра
                        </h1>
                        <p className="text-xs text-light-secondary -mt-1 hidden sm:block">Генератор Промтов и Изображения</p>
                    </div>
                </button>

                <nav className="hidden md:flex items-center gap-2">
                    <NavItems activePage={activePage} onNavigate={onNavigate} />
                </nav>

                <div className="md:hidden">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="inline-flex items-center justify-center p-2 rounded-md text-light-secondary hover:text-white hover:bg-dark-tertiary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        aria-controls="mobile-menu"
                        aria-expanded={isMenuOpen}
                    >
                        <span className="sr-only">Открыть главное меню</span>
                        {isMenuOpen ? <CloseIcon className="block h-6 w-6" /> : <BurgerIcon className="block h-6 w-6" />}
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden" id="mobile-menu">
                    <nav className="px-2 pt-4 pb-3 space-y-3 flex flex-col items-center">
                        <NavItems activePage={activePage} onNavigate={onNavigate} onLinkClick={() => setIsMenuOpen(false)}/>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
