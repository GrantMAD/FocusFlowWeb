'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Trophy, ArrowRight, Zap, Brain, Calendar, Moon, Sun } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

const CHECKLIST_ITEMS = [
  { id: 'ritual', label: 'Ritual Mastery', description: 'Complete your first Morning Ritual.', icon: Sun },
  { id: 'priorities', label: 'Priority Planner', description: 'Set your daily priorities.', icon: Calendar },
  { id: 'focus', label: 'Focus Pioneer', description: 'Start your first Focus Session.', icon: Zap },
  { id: 'braindump', label: 'Mind Clearer', description: 'Add a thought to your Brain Dump.', icon: Brain },
  { id: 'reflection', label: 'Daily Reflection', description: 'Complete an Evening Reflection.', icon: Moon },
];

export default function OnboardingChecklist() {
  const { profile, fetchProfile } = useAuthStore();
  const [isOpen, setIsOpen] = useState(true);
  const supabase = createClient();

  const progress = profile?.onboarding_progress || {};
  const completedCount = Object.values(progress).filter(Boolean).length;
  const isAllDone = completedCount === CHECKLIST_ITEMS.length;

  if (isAllDone && !isOpen) return null;

  return (
    <div className={`glass-card rounded-2xl overflow-hidden transition-all duration-500 ${isAllDone ? 'opacity-60 grayscale' : 'shadow-xl shadow-purple-100 dark:shadow-none'}`}>
      <div className="grad-primary p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">FocusFlow Mastery</h3>
            <p className="text-xs text-purple-100 font-medium">Master the essentials to unlock your potential.</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-white leading-none">{completedCount}/{CHECKLIST_ITEMS.length}</p>
          <p className="text-[10px] font-bold text-purple-200 uppercase tracking-widest mt-1">Steps Done</p>
        </div>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 bg-white/50 dark:bg-gray-900/50">
        {CHECKLIST_ITEMS.map((item) => {
          const isDone = !!progress[item.id as keyof typeof progress];
          return (
            <div 
              key={item.id}
              className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center text-center gap-2 ${
                isDone 
                  ? 'border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-900/10' 
                  : 'border-gray-50 dark:border-gray-800 bg-white dark:bg-gray-800'
              }`}
            >
              <div className={`p-2 rounded-lg ${isDone ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <p className={`text-[10px] font-black uppercase tracking-tighter ${isDone ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-900 dark:text-gray-100'}`}>
                  {item.label}
                </p>
              </div>
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-gray-200 dark:border-gray-700" />
              )}
            </div>
          );
        })}
      </div>
      
      {isAllDone && (
        <div className="p-3 bg-emerald-500 text-white text-center text-xs font-bold uppercase tracking-widest">
          🎉 All focus mastery steps completed! You're a pro.
        </div>
      )}
    </div>
  );
}
