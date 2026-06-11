'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Coffee, Brain, PenTool, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const ritualSteps = [
  { id: 'hydration', label: 'Hydration', icon: Coffee, description: 'Drink a glass of water.' },
  { id: 'meditation', label: 'Mindfulness', icon: Brain, description: '3 minutes of deep breathing.' },
  { id: 'priorities', label: 'Plan Day', icon: CheckCircle, description: 'Set your 3 daily priorities.' },
  { id: 'braindump', label: 'Brain Dump', icon: PenTool, description: 'Clear your mind of lingering tasks.' },
];

export default function MorningRitual() {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const supabase = createClient();

  const toggleStep = (id: string) => {
    setCompletedSteps(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
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
