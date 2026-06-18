import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { StatsGrid } from '@/components/progress/StatsGrid';
import { WinsFeed } from '@/components/progress/WinsFeed';
import WeeklyChartWrapper from '@/components/progress/WeeklyChartWrapper';

import { LineChart } from 'lucide-react';

export default async function ProgressPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/sign-in');

  // Fetch stats using the DB function
  // Fetch allowed start date based on subscription
  const { data: startDate } = await supabase.rpc('get_allowed_analytics_start_date', { p_user_id: user.id });

  // Fallback to 7 days ago if startDate is null
  const effectiveStartDate = startDate || new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0];

  // Fetch stats using the DB function, passing the allowed start date
  const { data: stats } = await supabase.rpc('get_weekly_stats', { 
    p_user_id: user.id,
    p_start_date: effectiveStartDate
  });
  const data = stats ? stats[0] : null;

  // Fetch dynamic daily breakdown
  const { data: breakdown } = await supabase.rpc('get_daily_stats_breakdown', { 
    p_user_id: user.id
  });

  const chartData = (breakdown || []).map((d: any) => ({
    day: d.day_label,
    minutes: Number(d.total_minutes),
    tasks: Number(d.tasks_count),
  }));

  return (
    <div className="min-h-full">
      {/* Hero Header */}
      <div className="grad-primary pt-12 pb-24 px-8">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm text-white shadow-lg">
            <LineChart className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white">Progress</h1>
            <p className="text-purple-100 font-medium">Your focus journey, visualized.</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 -mt-16 pb-12 space-y-8">
        {data && (
          <StatsGrid 
            totalTasksCompleted={Number(data.total_tasks_completed)}
            totalFocusMinutes={Number(data.total_focus_minutes)}
            totalSessions={Number(data.total_sessions)}
            avgMood={Number(data.avg_mood)}
          />
        )}

        <div className="glass-card p-8 rounded-2xl shadow-xl">
          <WeeklyChartWrapper data={chartData} />
        </div>
        
        <WinsFeed />
      </div>
    </div>
  );
}
