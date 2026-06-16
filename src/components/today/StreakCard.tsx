'use client';

import { useState, useEffect } from 'react';
import { Flame, Trophy, Target } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Streak } from '@/types';
import { createNotification } from '@/lib/notifications';

import { useAuthStore } from '@/stores/authStore';

export default function StreakCard() {
  const [streak, setStreak] = useState<Streak | null>(null);
  const [minutesToday, setMinutesToday] = useState(0);
  const { user } = useAuthStore();
  const supabase = createClient();

  useEffect(() => {
    if (!user) return;

    fetchStreak(user.id);
    fetchDailyMinutes(user.id);
    
    const channel = supabase
      .channel(`streak_changes_${user.id}_${Math.random().toString(36).substring(7)}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'streaks',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        const newStreak = payload.new as Streak;
        if (streak && newStreak.current_streak > streak.current_streak) {
          handleStreakMilestone(newStreak.current_streak);
        }
        setStreak(newStreak);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, streak?.current_streak]);

  const fetchDailyMinutes = async (userId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase.rpc('get_weekly_stats', { 
      p_user_id: userId,
      p_start_date: today
    });
    if (data?.[0]) setMinutesToday(Number(data[0].total_focus_minutes));
  };

  const handleStreakMilestone = async (days: number) => {
    if (!user) return;
    
    const milestones = [3, 7, 14, 30, 50, 100];
    if (milestones.includes(days)) {
      await createNotification(
        user.id,
        `${days}-Day Streak! 🔥`,
        `Incredible consistency! You've shown up for ${days} days in a row.`,
        'streak'
      );
    }
  };

  const fetchStreak = async (userId: string) => {
    const { data } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (data) setStreak(data as Streak);
  };

  return (
    <div className="grad-primary p-6 rounded-2xl shadow-xl text-white transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center justify-between mb-8">
        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md border border-white/20">
          <Flame className="w-8 h-8 text-orange-400 fill-orange-400 animate-pulse" />
        </div>
        <div className="text-right">
          <p className="text-purple-100 text-[10px] font-black uppercase tracking-[0.2em]">Current Streak</p>
          <p className="text-4xl font-black">{streak?.current_streak ?? 0} Days</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/10 group/stat">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-4 h-4 text-yellow-400 group-hover/stat:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-200">Longest</span>
          </div>
          <p className="text-xl font-black">{streak?.longest_streak ?? 0}</p>
        </div>
        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/10 group/stat">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-green-400 group-hover/stat:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-200">Wins</span>
          </div>
          <p className="text-xl font-black">{streak?.total_tasks_completed ?? 0}</p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-white/10 dark:border-white/5">
        <p className="text-sm text-purple-100 dark:text-purple-200">
          {minutesToday >= 10 ? (
            <span>Streak is <span className="font-bold">safe</span> for today! Keep it up. 🔥</span>
          ) : (
            <span>Focus for <span className="font-bold">{10 - minutesToday} more minutes</span> today to keep your streak alive!</span>
          )}
        </p>
      </div>
    </div>
  );
}
