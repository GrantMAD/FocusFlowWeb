'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const goals = [
  "Better focus",
  "Finish what I start",
  "Manage my time",
  "Reduce overwhelm",
  "Build habits",
  "Understand my ADHD",
  "Work/Life balance",
  "Boost productivity"
];

import { toast } from 'sonner';

export default function Step4() {
  const [selected, setSelected] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const toggleGoal = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const handleNext = async () => {
    setIsSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Session lost. Please sign in again.');
      return;
    }

    const { error } = await supabase.from('profiles').update({
      primary_goals: selected,
    }).eq('user_id', user.id);

    if (error) {
      toast.error('Failed to update: ' + error.message);
      setIsSaving(false);
    } else {
      router.push('/onboarding/step-5');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">What are your main goals?</h2>
        <p className="mt-2 text-gray-500">What does success look like for you?</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {goals.map((goal) => (
          <button
            key={goal}
            disabled={isSaving}
            onClick={() => toggleGoal(goal)}
            className={`p-3 text-sm font-medium border-2 rounded-xl transition-all ${
              selected.includes(goal)
                ? 'border-purple-600 bg-purple-50 text-purple-700'
                : 'border-gray-100 hover:border-gray-200 text-gray-600'
            } ${isSaving ? 'opacity-50' : ''}`}
          >
            {goal}
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={selected.length === 0 || isSaving}
        className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
      >
        {isSaving ? 'Saving...' : 'Continue'}
      </button>
    </div>
  );
}
