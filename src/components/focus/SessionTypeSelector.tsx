'use client';

import { useState } from 'react';
import { useFocusStore } from '@/stores/focusStore';
import { useSubscription } from '@/hooks/useSubscription';
import { Timer, Users, Zap, Settings2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';

const sessionTypes = [
  { id: 'pomodoro', label: 'Pomodoro', icon: Timer, description: '15m work, 5m break', premium: false, duration: 15 * 60 },
  { id: 'deep_work', label: 'Deep Work', icon: Zap, description: '60m intense focus', premium: true, duration: 60 * 60 },
  { id: 'body_doubling', label: 'Body Doubling', icon: Users, description: 'Simulated presence', premium: true, duration: 25 * 60 },
  { id: 'custom', label: 'Custom', icon: Settings2, description: 'Set your own time', premium: true, duration: 0 },
];

export default function SessionTypeSelector({ 
  onCustomSelect, 
  onTypeSelect,
  selectedId
}: { 
  onCustomSelect: () => void;
  onTypeSelect: (id: string, duration: number) => void;
  selectedId: string;
}) {
  const { isActive } = useFocusStore();
  const { isPro } = useSubscription();

  const handleSelect = (type: typeof sessionTypes[0]) => {
    if (type.id === 'custom') {
      onCustomSelect();
    } else {
      onTypeSelect(type.id, type.duration);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300">
      <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Session Type</h3>
      <div className="grid grid-cols-2 gap-3">
        {sessionTypes.map((type) => {
          const isLocked = type.premium && !isPro;
          const isSelected = selectedId === type.id;
          return (
            <button
              key={type.id}
              disabled={isActive || isLocked}
              onClick={() => handleSelect(type)}
              className={`p-3 rounded-xl border-2 transition-all text-left relative ${
                isLocked ? 'opacity-50 grayscale' : 
                isSelected ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20' :
                'border-gray-50 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/10'
              }`}
            >
              <type.icon className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-2" />
              <p className="text-xs font-bold text-gray-900 dark:text-gray-100">{type.label}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">{type.description}</p>
              {isLocked && (
                <span className="absolute top-2 right-2 text-[8px] bg-purple-600 text-white px-1.5 py-0.5 rounded-full font-bold">
                  PRO
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
