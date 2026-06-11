'use client';

import { useState, useEffect } from 'react';
import { Flame, Trophy, Target } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Streak } from '@/types';

export default function StreakCard() {
  const [streak, setStreak] = useState<Streak | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchStreak = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) setStreak(data as Streak);
    };

    fetchStreak();
  }, []);

  return (
    <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-6 rounded-2xl shadow-lg text-white">
      <div className="flex items-center justify-between mb-8">
        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
          <Flame className="w-8 h-8 text-orange-400 fill-orange-400" />
        </div>
        <div className="text-right">
          <p className="text-purple-100 text-sm font-medium">Current Streak</p>
          <p className="text-4xl font-black">{streak?.current_streak ?? 0} Days</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200">Best</span>
          </div>
          <p className="text-xl font-bold">{streak?.longest_streak ?? 0}</p>
        </div>
        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-green-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200">Total</span>
          </div>
          <p className="text-xl font-bold">{streak?.total_tasks_completed ?? 0}</p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-white/10">
        <p className="text-sm text-purple-100">
          Focus for <span className="font-bold">15 more minutes</span> today to keep your streak alive!
        </p>
      </div>
    </div>
  );
}
