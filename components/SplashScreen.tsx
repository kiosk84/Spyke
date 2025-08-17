import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-dark-primary flex items-center justify-center z-50 animate-fade-in">
       <span className="text-6xl font-black font-display tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-magenta animate-pulse-glow">
        EXPERT
       </span>
    </div>
  );
};

export default SplashScreen;
