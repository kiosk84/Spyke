import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import GeneratorPage from './components/pages/GeneratorPage';
import InfoPage from './components/pages/InfoPage';
import HistoryPage from './components/pages/HistoryPage';
import SettingsPage from './components/pages/SettingsPage';
import { Page } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('generator');

  const handleNavigate = useCallback((page: Page) => {
    setCurrentPage(page);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'info':
        return <InfoPage />;
      case 'history':
        return <HistoryPage />;
      case 'settings':
        return <SettingsPage />;
      case 'generator':
      default:
        return <GeneratorPage />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-primary flex flex-col">
      <Header activePage={currentPage} onNavigate={handleNavigate} />
      <main className="container mx-auto px-4 py-8 flex-grow">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
