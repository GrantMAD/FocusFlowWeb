'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Bell } from 'lucide-react';

import { toast } from 'sonner';

export default function Step5() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast.success('Notifications enabled!');
      }
    }
  };

  const handleFinish = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Session lost. Please sign in again.');
      return;
    }

    const { error } = await supabase.from('profiles').update({
      onboarding_completed: true,
    }).eq('user_id', user.id);

    if (error) {
      toast.error('Failed to complete onboarding: ' + error.message);
      setIsLoading(false);
    } else {
      router.push('/today');
      router.refresh();
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
          <Bell className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Stay on track?</h2>
        <p className="mt-2 text-gray-500">
          We can send you reminders for focus sessions and ritual check-ins.
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={async () => { await requestPermission(); await handleFinish(); }}
          disabled={isLoading}
          className="w-full bg-purple-600 text-white py-4 rounded-xl font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Finishing...' : 'Enable Notifications'}
        </button>
        <button
          onClick={handleFinish}
          disabled={isLoading}
          className="w-full bg-white text-gray-500 py-4 rounded-xl font-medium hover:text-gray-900 transition-colors disabled:opacity-50"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
