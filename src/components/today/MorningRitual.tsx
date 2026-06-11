'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Coffee, Brain, PenTool, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const ritualSteps = [
  { id: 'hydration', label: 'Hydration', icon: Coffee, description: 'Drink a glass of water.', dbColumn: 'ritual_hydration' },
  { id: 'meditation', label: 'Mindfulness', icon: Brain, description: '3 minutes of deep breathing.', dbColumn: 'ritual_meditation' },
  { id: 'priorities', label: 'Plan Day', icon: CheckCircle, description: 'Set your 3 daily priorities.', dbColumn: 'ritual_priorities' },
  { id: 'braindump', label: 'Brain Dump', icon: PenTool, description: 'Clear your mind of lingering tasks.', dbColumn: 'ritual_braindump' },
];

export default function MorningRitual() {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const supabase = createClient();

  useEffect(() => {
    fetchRitualStatus();
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
    }
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

  return (
    <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Morning Ritual</h2>
          <p className="text-sm text-gray-500">Start your day with intention.</p>
        </div>
        {isRitualComplete && (
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase">
            Complete
          </span>
        )}
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
                  ? 'border-purple-600 bg-purple-50' 
                  : 'border-gray-50 hover:border-gray-100'
              }`}
            >
              <div className={`p-2 rounded-lg ${isDone ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'}`}>
                <step.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className={`font-bold text-sm ${isDone ? 'text-purple-900' : 'text-gray-900'}`}>
                  {step.label}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
              {isDone ? (
                <CheckCircle2 className="w-5 h-5 text-purple-600 mt-1" />
              ) : (
                <Circle className="w-5 h-5 text-gray-200 mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
