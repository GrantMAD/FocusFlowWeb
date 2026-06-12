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
  const { data: stats } = await supabase.rpc('get_weekly_stats', { p_user_id: user.id });
  const data = stats ? stats[0] : null;

  // Placeholder data for chart until we implement daily breakdown
  const chartData = [
    { day: 'Mon', minutes: 120, tasks: 5 },
    { day: 'Tue', minutes: 80, tasks: 3 },
    { day: 'Wed', minutes: 160, tasks: 8 },
    { day: 'Thu', minutes: 100, tasks: 4 },
    { day: 'Fri', minutes: 200, tasks: 10 },
    { day: 'Sat', minutes: 40, tasks: 2 },
    { day: 'Sun', minutes: 0, tasks: 0 },
  ];

  return (
    <div className="max-w-6xl mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Progress</h1>
        <p className="text-gray-500">Your focus journey, visualized.</p>
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
