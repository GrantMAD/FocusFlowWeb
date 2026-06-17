'use client';

import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'gray';
  size?: 'xs' | 'sm';
  className?: string;
}

export default function Badge({ 
  children, 
  variant = 'gray', 
  size = 'xs',
  className = '' 
}: BadgeProps) {
  const variants = {
    primary: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
    secondary: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    warning: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
    danger: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    gray: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
  };

  const sizes = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-1 text-xs',
  };

  return (
    <span className={`inline-flex items-center font-bold uppercase tracking-wider rounded-full ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
}
