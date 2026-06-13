'use client';

import { useState, useEffect } from 'react';
import { Flame, Trophy, Target } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Streak } from '@/types';

import { useAuthStore } from '@/stores/authStore';

export default function StreakCard() {
  const [streak, setStreak] = useState<Streak | null>(null);
  const { user } = useAuthStore();
  const supabase = createClient();

  useEffect(() => {
    if (!user) return;

    fetchStreak(user.id);
    
    const channel = supabase
      .channel(`streak_changes_${user.id}_${Math.random().toString(36).substring(7)}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'streaks',
        filter: `user_id=eq.${user.id}`,
      }, () => {
        fetchStreak(user.id);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchStreak = async (userId: string) => {
    const { data } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (data) setStreak(data as Streak);
  };

  return (
    <div className="bg-gradient-to-br from-purple-600 to-indigo-700 dark:from-purple-900 dark:to-indigo-950 p-6 rounded-2xl shadow-lg text-white transition-all duration-300">
      <div className="flex items-center justify-between mb-8">
        <div className="bg-white/20 dark:bg-black/20 p-3 rounded-xl backdrop-blur-sm">
          <Flame className="w-8 h-8 text-orange-400 fill-orange-400" />
        </div>
        <div className="text-right">
          <p className="text-purple-100 dark:text-purple-200 text-sm font-medium">Current Streak</p>
          <p className="text-4xl font-black">{streak?.current_streak ?? 0} Days</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 dark:bg-black/10 p-4 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200 dark:text-purple-300">Best</span>
          </div>
          <p className="text-xl font-bold">{streak?.longest_streak ?? 0}</p>
        </div>
        <div className="bg-white/10 dark:bg-black/10 p-4 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-green-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200 dark:text-purple-300">Total</span>
          </div>
          <p className="text-xl font-bold">{streak?.total_tasks_completed ?? 0}</p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-white/10 dark:border-white/5">
        <p className="text-sm text-purple-100 dark:text-purple-200">
          Focus for <span className="font-bold">15 more minutes</span> today to keep your streak alive!
        </p>
      </div>
    </div>
  );
}
