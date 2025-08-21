
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import GeneratorPage from './components/pages/GeneratorPage';
import InfoPage from './components/pages/InfoPage';
import HistoryPage from './components/pages/HistoryPage';
import ChatPage from './components/pages/ChatPage';
import SettingsPage from './components/pages/SettingsPage';
import SplashScreen from './components/SplashScreen';
import ParticleBackground from './components/common/ParticleBackground';
import { Page } from './types';

const App: React.FC = () => {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('chat');

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
      case 'chat':
        return <ChatPage onNavigate={handleNavigate} />;
      case 'info':
        return <InfoPage />;
      case 'history':
        return <HistoryPage />;
      case 'generator':
        return <GeneratorPage onNavigate={handleNavigate} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <ChatPage onNavigate={handleNavigate} />;
    }
  };

  if (isAppLoading) {
    return <SplashScreen />;
  }
  
  const isChatPage = currentPage === 'chat';

  return (
    <>
      {isChatPage && <ParticleBackground />}
      <div className={`min-h-screen flex flex-col relative ${isChatPage ? 'h-screen overflow-hidden' : ''}`}>
        <Header activePage={currentPage} onNavigate={handleNavigate} />
        <main className={`flex-grow flex flex-col ${isChatPage ? 'h-full' : 'container mx-auto px-4 py-8'}`}>
          {renderPage()}
        </main>
        {!isChatPage && <Footer />}
      </div>
    </>
  );
};

export default App;
