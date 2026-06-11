'use client';

import { useFocusStore } from '@/stores/focusStore';
import { useSubscription } from '@/hooks/useSubscription';
import { Timer, Users, Zap, Settings2 } from 'lucide-react';

const sessionTypes = [
  { id: 'pomodoro', label: 'Pomodoro', icon: Timer, description: '25m work, 5m break', premium: false },
  { id: 'deep_work', label: 'Deep Work', icon: Zap, description: '60m intense focus', premium: true },
  { id: 'body_doubling', label: 'Body Doubling', icon: Users, description: 'Simulated presence', premium: true },
  { id: 'custom', label: 'Custom', icon: Settings2, description: 'Set your own time', premium: true },
];

export default function SessionTypeSelector() {
  const { startSession, isActive } = useFocusStore();
  const { isPro } = useSubscription();

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h3 className="font-bold text-gray-900 mb-4">Session Type</h3>
      <div className="grid grid-cols-2 gap-3">
        {sessionTypes.map((type) => {
          const isLocked = type.premium && !isPro;
          return (
            <button
              key={type.id}
              disabled={isActive || isLocked}
              onClick={() => startSession(type.id as any, type.id === 'deep_work' ? 60 * 60 : 25 * 60)}
              className={`p-3 rounded-xl border-2 transition-all text-left relative ${
                isLocked ? 'opacity-50 grayscale' : 'hover:border-purple-200 hover:bg-purple-50'
              } border-gray-50`}
            >
              <type.icon className="w-5 h-5 text-purple-600 mb-2" />
              <p className="text-xs font-bold text-gray-900">{type.label}</p>
              <p className="text-[10px] text-gray-500">{type.description}</p>
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
