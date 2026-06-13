'use client';

import { X } from 'lucide-react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export default function Modal({ isOpen, onClose, title, children }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in duration-200 transition-colors">
        <header className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-gray-900 dark:text-gray-100">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}
