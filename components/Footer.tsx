import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-6 mt-12 border-t border-dark-tertiary">
      <div className="container mx-auto px-4 text-center text-light-secondary">
        <p>&copy; {new Date().getFullYear()} Генератор Промтов и Изображения «Искра». Создано с помощью AI.</p>
      </div>
    </footer>
  );
};

export default Footer;