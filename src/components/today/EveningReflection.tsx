'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun, Pill, MessageSquare, CheckCircle2, Star, Zap } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

const MOODS = [
  { value: 1, label: '😩' },
  { value: 2, label: '😕' },
  { value: 3, label: '😐' },
  { value: 4, label: '🙂' },
  { value: 5, label: '🤩' },
];

const ENERGY_LEVELS = [
  { value: 1, label: 'Drained' },
  { value: 2, label: 'Low' },
  { value: 3, label: 'Moderate' },
  { value: 4, label: 'Good' },
  { value: 5, label: 'High' },
];

export default function EveningReflection() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [reflection, setReflection] = useState({
    mood_evening: 3,
    energy_level: 3,
    medication_taken: false,
    notes: '',
    evening_reflection_completed: false,
  });

  const supabase = createClient();

  useEffect(() => {
    fetchReflectionStatus();
  }, []);

  const fetchReflectionStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: log } = await supabase.rpc('get_or_create_daily_log', { p_user_id: user.id });

    if (log) {
      setReflection({
        mood_evening: log.mood_evening || 3,
        energy_level: log.energy_level || 3,
        medication_taken: log.medication_taken || false,
        notes: log.notes || '',
        evening_reflection_completed: log.evening_reflection_completed || false,
      });
    }
    setIsLoading(false);
  };

  const handleUpdate = async (updates: Partial<typeof reflection>) => {
    const newReflection = { ...reflection, ...updates };
    setReflection(newReflection);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('daily_logs')
      .update(updates)
      .eq('user_id', user.id)
      .eq('date', new Date().toISOString().split('T')[0]);

    if (error) {
      toast.error('Failed to update reflection');
    }
  };

  const handleComplete = async () => {
    setIsSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('daily_logs')
      .update({ evening_reflection_completed: true })
      .eq('user_id', user.id)
      .eq('date', new Date().toISOString().split('T')[0]);

    if (error) {
      toast.error('Failed to complete reflection');
    } else {
      setReflection(prev => ({ ...prev, evening_reflection_completed: true }));
      toast.success('Reflection completed!');
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 animate-pulse h-[400px]">
        <div className="h-6 w-48 bg-gray-100 dark:bg-gray-800 rounded mb-4"></div>
        <div className="space-y-6 mt-8">
          <div className="h-20 bg-gray-50 dark:bg-gray-800 rounded-xl"></div>
          <div className="h-20 bg-gray-50 dark:bg-gray-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Moon className="w-5 h-5 text-indigo-500" />
            Evening Reflection
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Wind down and celebrate small wins.</p>
        </div>
        {reflection.evening_reflection_completed && (
          <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-bold rounded-full uppercase">
            Reflection Done
          </span>
        )}
      </div>

      <div className="space-y-8">
        {/* Mood Tracker */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            How was your day?
          </label>
          <div className="flex justify-between gap-2">
            {MOODS.map(mood => (
              <button
                key={mood.value}
                onClick={() => handleUpdate({ mood_evening: mood.value })}
                className={`flex-1 aspect-square text-2xl rounded-xl border-2 transition-all flex items-center justify-center ${
                  reflection.mood_evening === mood.value 
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' 
                    : 'border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {mood.label}
              </button>
            ))}
          </div>
        </div>

        {/* Energy Tracker */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-orange-500" />
            Energy Levels
          </label>
          <div className="flex gap-2">
            {ENERGY_LEVELS.map(level => (
              <button
                key={level.value}
                onClick={() => handleUpdate({ energy_level: level.value })}
                className={`flex-1 py-3 px-1 text-[10px] font-bold uppercase tracking-tighter rounded-xl border-2 transition-all text-center ${
                  reflection.energy_level === level.value 
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400' 
                    : 'border-gray-50 dark:border-gray-800 text-gray-400 dark:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>

        {/* Medication & Notes Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => handleUpdate({ medication_taken: !reflection.medication_taken })}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
              reflection.medication_taken 
                ? 'border-green-600 bg-green-50 dark:bg-green-900/20' 
                : 'border-gray-50 dark:border-gray-800 hover:border-gray-100 dark:hover:border-gray-700'
            }`}
          >
            <div className={`p-2 rounded-lg ${reflection.medication_taken ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
              <Pill className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className={`font-bold text-sm ${reflection.medication_taken ? 'text-green-900 dark:text-green-100' : 'text-gray-900 dark:text-gray-100'}`}>
                Medication
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Did you take your meds?</p>
            </div>
            {reflection.medication_taken ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-1" />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-gray-200 dark:border-gray-700 mt-1" />
            )}
          </button>

          <div className="relative">
            <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <textarea
              placeholder="Notes, wins, or reflections..."
              value={reflection.notes}
              onChange={(e) => handleUpdate({ notes: e.target.value })}
              className="w-full h-full min-h-[56px] pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-50 dark:border-gray-800 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm resize-none"
            />
          </div>
        </div>

        {!reflection.evening_reflection_completed && (
          <button
            onClick={handleComplete}
            disabled={isSaving}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Complete Daily Reflection'}
          </button>
        )}
      </div>
    </section>
  );
}
