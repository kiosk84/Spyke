import React from 'react';

const HistoryPage: React.FC = () => {
  return (
    <div className="bg-dark-secondary p-8 rounded-2xl shadow-lg border border-dark-tertiary/50 max-w-4xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-magenta font-display">
        История генераций
      </h1>
      <p className="text-light-secondary mt-4 text-lg">
        Этот раздел находится в разработке.
      </p>
      <p className="text-light-secondary mt-2">
        Совсем скоро вы сможете просматривать здесь все созданные вами изображения и промпты.
      </p>
    </div>
  );
};

export default HistoryPage;
