'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Bell } from 'lucide-react';

import { toast } from 'sonner';

export default function Step5() {
  const [isLoading, setIsLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | 'unsupported'>('default');
  const router = useRouter();
  const supabase = createClient();

  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      if (permission === 'granted') {
        toast.success('Notifications enabled!');
      } else {
        toast.error('Notifications blocked.');
      }
    } else {
      setPermissionStatus('unsupported');
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
    <div className="space-y-12">
      <div className="text-center">
        <div className="mx-auto w-20 h-20 grad-primary rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-purple-100 rotate-3">
          <Bell className="w-10 h-10 text-white animate-bounce" />
        </div>
        <h2 className="text-4xl font-black text-gray-900 leading-tight">Stay in Flow?</h2>
        <p className="mt-3 text-gray-500 font-medium px-4">
          Enable reminders to anchor your day and build a lasting focus streak.
        </p>
      </div>

      {/* Simulated Notification Preview */}
      <div className="relative">
        <div className="absolute inset-0 bg-purple-100/50 blur-2xl rounded-full transform -scale-y-75 translate-y-4" />
        <div className="relative glass-card p-4 rounded-2xl border border-gray-100 flex items-center gap-4 animate-in slide-in-from-top-4 duration-1000 shadow-lg">
          <div className="w-10 h-10 rounded-xl grad-primary flex items-center justify-center text-white font-black text-xs">
            FF
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-gray-900 truncate">FocusFlow Reminder</p>
            <p className="text-[10px] text-gray-500 font-medium">Time for your Morning Ritual! ☕️</p>
          </div>
          <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Now</div>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={requestPermission}
          disabled={isLoading || permissionStatus === 'granted'}
          className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl hover:scale-[1.02] active:scale-100 ${
            permissionStatus === 'granted' 
              ? 'bg-emerald-500 text-white' 
              : 'grad-primary text-white'
          }`}
        >
          {permissionStatus === 'granted' ? 'Notifications Enabled!' : 'Allow Reminders'}
        </button>
        
        <button
          onClick={handleFinish}
          disabled={isLoading}
          className="w-full bg-white text-gray-400 py-4 rounded-2xl font-bold hover:text-gray-900 hover:bg-gray-50 transition-all border border-gray-100"
        >
          {permissionStatus === 'granted' ? 'Finish Setup' : 'Maybe later'}
        </button>
      </div>
    </div>
  );
}
