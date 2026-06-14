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
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-card w-full max-w-sm rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in duration-200 transition-all">
        <header className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-400">
            <X className="w-6 h-6" />
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}
