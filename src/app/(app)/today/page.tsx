'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useTaskStore } from '@/stores/taskStore';
import DailyPriorities from '@/components/today/DailyPriorities';
import MorningRitual from '@/components/today/MorningRitual';
import StreakCard from '@/components/today/StreakCard';
import QuickCapture from '@/components/today/QuickCapture';

export default function TodayPage() {
  const { fetchProfile } = useAuthStore();
  const { fetchTasks } = useTaskStore();

  useEffect(() => {
    fetchProfile();
    fetchTasks();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Today</h1>
        <p className="text-gray-500">Let's make today count.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <DailyPriorities />
          <MorningRitual />
        </div>
        
        <div className="space-y-8">
          <StreakCard />
          <QuickCapture />
        </div>
      </div>
    </div>
  );
}
