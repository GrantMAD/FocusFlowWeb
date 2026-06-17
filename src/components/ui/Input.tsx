'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 ml-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent rounded-xl px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none focus:border-purple-500 transition-all ${
            error ? 'border-red-500 focus:border-red-500' : ''
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="text-[10px] font-bold text-red-500 ml-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
