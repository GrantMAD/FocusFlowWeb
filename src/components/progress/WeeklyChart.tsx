'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { Clock, CheckSquare } from 'lucide-react';

interface WeeklyChartData {
  day: string;
  minutes: number;
  tasks: number;
}

interface WeeklyChartProps {
  data: WeeklyChartData[];
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  const isDarkMode = typeof window !== 'undefined' && window.document.documentElement.classList.contains('dark');
  const gridColor = isDarkMode ? '#1F2937' : '#F3F4F6';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Focus Minutes */}
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Focus Minutes
          </h3>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Track your daily focus time.</p>

        <div className="h-64 w-full min-h-64">
          <ResponsiveContainer width="100%" height={256}>
            <BarChart data={data}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={gridColor}
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 'bold' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 'bold' }}
              />
              <Tooltip
                cursor={{ fill: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}
                contentStyle={{
                  backgroundColor: isDarkMode ? '#111827' : '#FFFFFF',
                  borderRadius: '16px',
                  border: 'none',
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              />
              <Bar dataKey="minutes" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tasks Completed */}
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-2 mb-1">
          <CheckSquare className="w-5 h-5 text-emerald-500" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Tasks Completed
          </h3>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Visualize your completed tasks over the week.</p>

        <div className="h-64 w-full min-h-64">
          <ResponsiveContainer width="100%" height={256}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={gridColor}
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 'bold' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 'bold' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? '#111827' : '#FFFFFF',
                  borderRadius: '16px',
                  border: 'none',
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              />
              <Area
                type="monotone"
                dataKey="tasks"
                stroke="#10B981"
                strokeWidth={4}
                fill="url(#areaGradient)"
                dot={{ fill: '#10B981', r: 4, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}