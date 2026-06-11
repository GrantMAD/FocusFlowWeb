'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

import { toast } from 'sonner';

export default function Step1() {
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.user_metadata?.full_name) {
        setName(user.user_metadata.full_name);
      }
    });
  }, []);

  const handleNext = async () => {
    setIsSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Session lost. Please sign in again.');
      return;
    }

    const { error } = await supabase.from('profiles').upsert({
      user_id: user.id,
      full_name: name,
    }, { onConflict: 'user_id' });

    if (error) {
      toast.error('Failed to save profile: ' + error.message);
      setIsSaving(false);
    } else {
      router.push('/onboarding/step-2');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">What should we call you?</h2>
        <p className="mt-2 text-gray-500">We'll use this to personalise your experience.</p>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
          autoFocus
          disabled={isSaving}
        />
        <button
          onClick={handleNext}
          disabled={!name.trim() || isSaving}
          className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
