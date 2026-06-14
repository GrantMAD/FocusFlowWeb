import { Clock, CheckSquare, Zap, TrendingUp } from 'lucide-react';

interface StatsGridProps {
  totalTasksCompleted: number;
  totalFocusMinutes: number;
  totalSessions: number;
  avgMood: number;
}

export function StatsGrid({ totalTasksCompleted, totalFocusMinutes, totalSessions, avgMood }: StatsGridProps) {
  const stats = [
    { label: 'Focus Minutes', value: totalFocusMinutes.toString(), icon: Clock, color: 'text-white', bg: 'bg-purple-600', borderColor: 'border-l-purple-500' },
    { label: 'Tasks Done', value: totalTasksCompleted.toString(), icon: CheckSquare, color: 'text-white', bg: 'bg-emerald-600', borderColor: 'border-l-emerald-500' },
    { label: 'Sessions', value: totalSessions.toString(), icon: Zap, color: 'text-white', bg: 'bg-orange-500', borderColor: 'border-l-orange-500' },
    { label: 'Avg. Mood', value: avgMood?.toString() || 'N/A', icon: TrendingUp, color: 'text-white', bg: 'bg-blue-600', borderColor: 'border-l-blue-600' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div key={stat.label} className={`glass-card p-6 rounded-2xl shadow-sm border-l-4 ${stat.borderColor} hover:scale-[1.02] transition-all duration-300`}>
          <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
            <stat.icon className="w-6 h-6" />
          </div>
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
          <p className="text-3xl font-black text-gray-900 dark:text-gray-100">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
