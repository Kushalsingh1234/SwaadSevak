import React from 'react';

interface VegIconProps {
  isVeg: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const VegIcon: React.FC<VegIconProps> = ({ isVeg, size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'w-3.5 h-3.5 p-0.5',
    md: 'w-4 h-4 p-0.5',
    lg: 'w-5 h-5 p-1'
  };

  const dotSizeMap = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5'
  };

  return (
    <div
      title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
      className={`inline-flex items-center justify-center rounded-sm border ${
        isVeg ? 'border-green-600' : 'border-red-600'
      } ${sizeMap[size]} ${className}`}
    >
      <div
        className={`rounded-full ${
          isVeg ? 'bg-green-600' : 'bg-red-600'
        } ${dotSizeMap[size]}`}
      />
    </div>
  );
};
