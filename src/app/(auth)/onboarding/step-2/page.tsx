'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const statuses = [
  { id: 'diagnosed', label: 'Professionally Diagnosed', description: 'I have a formal ADHD diagnosis.' },
  { id: 'self_identified', label: 'Self-Identified', description: 'I identify with ADHD traits but lack a formal diagnosis.' },
  { id: 'exploring', label: 'Just Exploring', description: "I'm curious if ADHD tools can help me focus." },
];

import { toast } from 'sonner';

export default function Step2() {
  const [selected, setSelected] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleNext = async () => {
    setIsSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Session lost. Please sign in again.');
      return;
    }

    const { error } = await supabase.from('profiles').update({
      diagnosis_status: selected,
    }).eq('user_id', user.id);

    if (error) {
      toast.error('Failed to update: ' + error.message);
      setIsSaving(false);
    } else {
      router.push('/onboarding/step-3');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Your ADHD Journey</h2>
        <p className="mt-2 text-gray-500">This helps us tailor the insights you receive.</p>
      </div>

      <div className="space-y-3">
        {statuses.map((status) => (
          <button
            key={status.id}
            disabled={isSaving}
            onClick={() => setSelected(status.id)}
            className={`w-full p-4 text-left border-2 rounded-xl transition-all ${
              selected === status.id
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-100 hover:border-gray-200'
            } ${isSaving ? 'opacity-50' : ''}`}
          >
            <p className="font-bold text-gray-900">{status.label}</p>
            <p className="text-sm text-gray-500">{status.description}</p>
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={!selected || isSaving}
        className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
      >
        {isSaving ? 'Saving...' : 'Continue'}
      </button>
    </div>
  );
}
