'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useTaskStore } from '@/stores/taskStore';
import DailyPriorities from '@/components/today/DailyPriorities';
import MorningRitual from '@/components/today/MorningRitual';
import EveningReflection from '@/components/today/EveningReflection';
import StreakCard from '@/components/today/StreakCard';
import QuickCapture from '@/components/today/QuickCapture';
import OnboardingChecklist from '@/components/ui/OnboardingChecklist';

export default function TodayPage() {
  const { fetchProfile } = useAuthStore();
  const { fetchTasks } = useTaskStore();

  useEffect(() => {
    fetchProfile();
    fetchTasks();
  }, []);

  return (
    <div className="min-h-full">
      {/* Hero Header */}
      <div className="grad-primary pt-12 pb-24 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-black text-white">Today</h1>
          <p className="text-purple-100 font-medium">Let's make today count.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-8 -mt-16 pb-12 space-y-8">
        <OnboardingChecklist />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <DailyPriorities />
            <MorningRitual />
            <EveningReflection />
          </div>
          
          <div className="space-y-8">
            <StreakCard />
            <QuickCapture />
          </div>
        </div>
      </div>
    </div>
  );
}
