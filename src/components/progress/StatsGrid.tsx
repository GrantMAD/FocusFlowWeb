import { Clock, CheckSquare, Zap, TrendingUp } from 'lucide-react';

interface StatsGridProps {
  totalTasksCompleted: number;
  totalFocusMinutes: number;
  totalSessions: number;
  avgMood: number;
}

export function StatsGrid({ totalTasksCompleted, totalFocusMinutes, totalSessions, avgMood }: StatsGridProps) {
  const stats = [
    { label: 'Focus Minutes', value: totalFocusMinutes.toString(), icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Tasks Done', value: totalTasksCompleted.toString(), icon: CheckSquare, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Sessions', value: totalSessions.toString(), icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Avg. Mood', value: avgMood?.toString() || 'N/A', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
            <stat.icon className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-gray-500">{stat.label}</p>
          <p className="text-2xl font-black text-gray-900">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
