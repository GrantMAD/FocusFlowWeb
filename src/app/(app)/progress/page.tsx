import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { StatsGrid } from '@/components/progress/StatsGrid';
import { WinsFeed } from '@/components/progress/WinsFeed';
import WeeklyChartWrapper from '@/components/progress/WeeklyChartWrapper';

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
    <div className="max-w-6xl mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Progress</h1>
        <p className="text-gray-500 dark:text-gray-400">Your focus journey, visualized.</p>
      </header>

      {data && (
        <StatsGrid 
          totalTasksCompleted={Number(data.total_tasks_completed)}
          totalFocusMinutes={Number(data.total_focus_minutes)}
          totalSessions={Number(data.total_sessions)}
          avgMood={Number(data.avg_mood)}
        />
      )}

      <WeeklyChartWrapper data={chartData} />
      <WinsFeed />
    </div>
  );
}
