import { Loader2 as LoaderIcon } from 'lucide-react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  thickness?: number;
  className?: string;
  text?: string;
  variant?: 'spinner' | 'lucide';
}

export const Loader = ({ size = 'md', color = '#3b82f6', thickness = 3,className = '',text, variant = 'spinner'}: LoaderProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const lucideSizes = {
    sm: 24,
    md: 32,
    lg: 48,
    xl: 64
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center ${className}`}>
      {variant === 'lucide' ? (
        <LoaderIcon
          size={lucideSizes[size]} 
          color={color} 
          className="animate-spin" 
          strokeWidth={thickness}
        />
      ) : (
        <div 
          className={`${sizeClasses[size]} animate-spin rounded-full border-solid border-gray-200`}
          style={{
            borderWidth: `${thickness}px`,
            borderTopColor: color,
          }}
        />
      )}
      {text && (
        <p className={`mt-3 text-gray-600 ${textSizeClasses[size]} font-medium`}>
          {text}
        </p>
      )}
    </div>
  );
};

