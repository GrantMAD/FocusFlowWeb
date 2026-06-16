'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Coffee, Brain, PenTool, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { createNotification } from '@/lib/notifications';

const ritualSteps = [
  { id: 'hydration', label: 'Hydration', icon: Coffee, description: 'Drink a glass of water.', dbColumn: 'ritual_hydration' },
  { id: 'meditation', label: 'Mindfulness', icon: Brain, description: '3 minutes of deep breathing.', dbColumn: 'ritual_meditation' },
  { id: 'priorities', label: 'Plan Day', icon: CheckCircle, description: 'Set your 3 daily priorities.', dbColumn: 'ritual_priorities' },
  { id: 'braindump', label: 'Brain Dump', icon: PenTool, description: 'Clear your mind of lingering tasks.', dbColumn: 'ritual_braindump' },
];

const MOODS = [
  { value: 1, label: '😩' },
  { value: 2, label: '😕' },
  { value: 3, label: '😐' },
  { value: 4, label: '🙂' },
  { value: 5, label: '🤩' },
];

export default function MorningRitual() {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [moodMorning, setMoodMorning] = useState<number | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasNotified, setHasNotified] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchRitualStatus().then(() => setIsInitialized(true));
  }, []);

  const fetchRitualStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Use RPC to get/create daily log
    const { data: log } = await supabase
      .rpc('get_or_create_daily_log', { p_user_id: user.id });

    if (log) {
      const activeSteps = ritualSteps
        .filter(step => log[step.dbColumn as keyof typeof log])
        .map(step => step.id);
      setCompletedSteps(activeSteps);
      setMoodMorning(log.mood_morning);
      if (log.morning_ritual_completed) setHasNotified(true);
    }
  };

  const handleMoodSelect = async (mood: number) => {
    setMoodMorning(mood);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('daily_logs')
      .update({ mood_morning: mood })
      .eq('user_id', user.id)
      .eq('date', new Date().toISOString().split('T')[0]);
  };

  const toggleStep = async (stepId: string) => {
    const step = ritualSteps.find(s => s.id === stepId);
    if (!step) return;

    const isCurrentlyDone = completedSteps.includes(stepId);
    const newSteps = isCurrentlyDone 
      ? completedSteps.filter(s => s !== stepId) 
      : [...completedSteps, stepId];
    
    setCompletedSteps(newSteps);

    // Persist specific step completion AND total completion status
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const updatePayload = { 
      [step.dbColumn]: !isCurrentlyDone,
      morning_ritual_completed: newSteps.length === ritualSteps.length 
    };

    await supabase
      .from('daily_logs')
      .update(updatePayload)
      .eq('user_id', user.id)
      .eq('date', new Date().toISOString().split('T')[0]);
  };

  const isRitualComplete = completedSteps.length === ritualSteps.length;
  const { completeOnboardingStep } = useAuthStore();

  useEffect(() => {
    if (isRitualComplete && isInitialized && !hasNotified) {
      completeOnboardingStep('ritual');
      setHasNotified(true);
      
      const sendNotification = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await createNotification(
            user.id,
            'Ritual Complete! ☕',
            'You started your day with intention. Great work!',
            'success'
          );
        }
      };
      sendNotification();
    }
  }, [isRitualComplete, isInitialized, hasNotified]);

  return (
    <section className="glass-card p-6 rounded-2xl shadow-sm border-t-4 border-t-emerald-500 transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Morning Ritual</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Start your day with intention.</p>
        </div>
        {isRitualComplete && (
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full uppercase">
            Complete
          </span>
        )}
      </div>

      <div className="mb-8">
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
          Morning Mood
        </label>
        <div className="flex justify-between gap-2">
          {MOODS.map(mood => (
            <button
              key={mood.value}
              onClick={() => handleMoodSelect(mood.value)}
              className={`flex-1 aspect-square text-2xl rounded-xl border-2 transition-all flex items-center justify-center ${
                moodMorning === mood.value 
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20' 
                  : 'border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {mood.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ritualSteps.map((step) => {
          const isDone = completedSteps.includes(step.id);
          return (
            <button
              key={step.id}
              onClick={() => toggleStep(step.id)}
              className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                isDone 
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20' 
                  : 'border-gray-50 dark:border-gray-800 hover:border-gray-100 dark:hover:border-gray-700'
              }`}
            >
              <div className={`p-2 rounded-lg ${isDone ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                <step.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className={`font-bold text-sm ${isDone ? 'text-purple-900 dark:text-purple-100' : 'text-gray-900 dark:text-gray-100'}`}>
                  {step.label}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{step.description}</p>
              </div>
              {isDone ? (
                <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-1" />
              ) : (
                <Circle className="w-5 h-5 text-gray-200 dark:text-gray-700 mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
