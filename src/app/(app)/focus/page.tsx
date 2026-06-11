'use client';

import { useEffect, useState } from 'react';
import { useFocusStore } from '@/stores/focusStore';
import { useSubscription } from '@/hooks/useSubscription';
import FocusTimer from '@/components/focus/FocusTimer';
import SessionTypeSelector from '@/components/focus/SessionTypeSelector';
import AmbientSoundPicker from '@/components/focus/AmbientSoundPicker';
import { Play, Pause, X, RotateCcw } from 'lucide-react';

export default function FocusPage() {
  const { isActive, startSession, pauseSession, resumeSession, endSession, timeLeft, mode } = useFocusStore();
  const { isPro } = useSubscription();

  useEffect(() => {
    const timer = setInterval(() => {
      useFocusStore.getState().tick();
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gray-50">
      <div className="max-w-2xl w-full flex flex-col items-center gap-12">
        <header className="text-center">
          <span className={`px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider ${
            mode === 'work' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
          }`}>
            {mode === 'work' ? 'Focus Time' : 'Break Time'}
          </span>
          <h1 className="mt-4 text-4xl font-black text-gray-900">
            {mode === 'work' ? 'Get into the flow' : 'Take a breather'}
          </h1>
        </header>

        <div className="relative flex flex-col items-center">
          <div className="text-[12rem] font-black tabular-nums text-gray-900 leading-none">
            {formatTime(timeLeft)}
          </div>
          
          <div className="flex gap-4 mt-8">
            {!isActive ? (
              <button
                onClick={() => timeLeft === 25 * 60 ? startSession('pomodoro', 25 * 60) : resumeSession()}
                className="w-20 h-20 rounded-full bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 transition-all shadow-xl hover:scale-105"
              >
                <Play className="w-10 h-10 fill-white" />
              </button>
            ) : (
              <button
                onClick={pauseSession}
                className="w-20 h-20 rounded-full bg-white text-gray-900 border-2 border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all shadow-md"
              >
                <Pause className="w-10 h-10 fill-gray-900" />
              </button>
            )}

            {(isActive || timeLeft < 25 * 60) && (
              <button
                onClick={() => endSession(false)}
                className="w-20 h-20 rounded-full bg-white text-red-500 border-2 border-red-50 flex items-center justify-center hover:bg-red-50 transition-all shadow-md"
              >
                <X className="w-10 h-10" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          <SessionTypeSelector />
          <AmbientSoundPicker />
        </div>
      </div>
    </div>
  );
}
