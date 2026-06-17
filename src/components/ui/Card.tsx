'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  glass?: boolean;
}

export default function Card({ children, className = '', glass = false }: CardProps) {
  const baseStyles = 'rounded-2xl border transition-all duration-300';
  const glassStyles = 'glass-card shadow-xl';
  const plainStyles = 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-sm';

  return (
    <div className={`${baseStyles} ${glass ? glassStyles : plainStyles} ${className}`}>
      {children}
    </div>
  );
}
