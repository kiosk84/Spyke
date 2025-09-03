import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import GeneratorPage from './components/pages/GeneratorPage';
import EditorPage from './components/pages/EditorPage';
import InfoPage from './components/pages/InfoPage';
import HistoryPage from './components/pages/HistoryPage';
import ChatPage from './components/pages/ChatPage';
import SettingsPage from './components/pages/SettingsPage';
import SplashScreen from './components/SplashScreen';
import ParticleBackground from './components/common/ParticleBackground';
import { Page } from './types';
import { useTelegram } from './hooks/useTelegram';
import LandingPage from './components/pages/LandingPage';
import TimeMachinePage from './components/pages/TimeMachinePage';
import UserPage from './components/pages/UserPage';
import PromptLibraryPage from './components/pages/PromptLibraryPage';
import { USER_BALANCE_KEY, DEFAULT_BALANCE } from './constants';

const App: React.FC = () => {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const { tg, user } = useTelegram();

  const [balance, setBalance] = useState<number>(() => {
    const savedBalance = localStorage.getItem(USER_BALANCE_KEY);
    if (savedBalance) {
      const parsedBalance = parseInt(savedBalance, 10);
      return !isNaN(parsedBalance) ? parsedBalance : DEFAULT_BALANCE;
    }
    localStorage.setItem(USER_BALANCE_KEY, String(DEFAULT_BALANCE));
    return DEFAULT_BALANCE;
  });

  const handleBalanceChange = useCallback((newBalance: number | ((prev: number) => number)) => {
    setBalance(prevBalance => {
      const updatedBalance = typeof newBalance === 'function' ? newBalance(prevBalance) : newBalance;
      localStorage.setItem(USER_BALANCE_KEY, String(updatedBalance));
      return updatedBalance;
    });
  }, []);


  useEffect(() => {
    // Инициализация Telegram Web App
    if (tg) {
      tg.ready();
      tg.expand();
    }
  }, [tg]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const handleNavigate = useCallback((page: Page) => {
    setCurrentPage(page);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'chat':
        return <ChatPage onNavigate={handleNavigate} />;
      case 'info':
        return <InfoPage />;
      case 'history':
        return <HistoryPage />;
      case 'generator':
        return <GeneratorPage onNavigate={handleNavigate} balance={balance} onBalanceChange={handleBalanceChange} />;
      case 'editor':
        return <EditorPage balance={balance} onBalanceChange={handleBalanceChange} />;
      case 'timeMachine':
        return <TimeMachinePage balance={balance} onBalanceChange={handleBalanceChange} />;
      case 'promptLibrary':
        return <PromptLibraryPage />;
      case 'settings':
        return <SettingsPage />;
      case 'user':
        return <UserPage onBalanceReset={() => handleBalanceChange(DEFAULT_BALANCE)} />;
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  if (isAppLoading) {
    return <SplashScreen />;
  }
  
  const showParticles = currentPage === 'chat' || currentPage === 'landing';
  const showHeaderAndFooter = currentPage !== 'landing';

  // Determine main element classes based on current page
  let mainClasses = 'flex-grow flex flex-col';
  if (currentPage === 'chat') {
    mainClasses += ' h-full'; // for full-height chat
  } else if (currentPage === 'landing') {
    mainClasses += ' items-center justify-center'; // to center the landing content
  } else {
    mainClasses += ' container mx-auto px-4 py-8'; // default container
  }

  return (
    <>
      {showParticles && <ParticleBackground />}
      <div className={`min-h-screen flex flex-col relative ${currentPage === 'chat' ? 'h-screen overflow-hidden' : ''}`}>
        {showHeaderAndFooter && <Header activePage={currentPage} onNavigate={handleNavigate} tgUser={user} balance={balance} />}
        <main className={mainClasses}>
          {renderPage()}
        </main>
        {showHeaderAndFooter && <Footer />}
      </div>
    </>
  );
};

export default App;