import React from 'react';
import Loader from './Loader';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  Icon?: React.ElementType;
}

const Button: React.FC<ButtonProps> = ({
  isLoading = false,
  children,
  variant = 'primary',
  Icon,
  className,
  ...props
}) => {
  const baseClasses = "flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-primary disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.03]";
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-brand-cyan to-brand-magenta text-white shadow-lg shadow-brand-cyan/20 hover:shadow-glow-cyan focus:ring-brand-cyan',
    secondary: 'bg-dark-tertiary text-light-primary hover:bg-opacity-80 focus:ring-light-secondary',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5" />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
