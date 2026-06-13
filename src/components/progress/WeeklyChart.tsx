'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

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
  const tickColor = isDarkMode ? '#9CA3AF' : '#9CA3AF'; // Using gray-400 for both for now, can refine
  const gridColor = isDarkMode ? '#1F2937' : '#F3F4F6'; // gray-800 vs gray-100

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Focus Minutes */}
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">
          Focus Minutes (Last 7 Days)
        </h3>

        <div className="h-64 w-full min-h-64">
          <ResponsiveContainer width="100%" height={256}>
            <BarChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={gridColor}
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
              />
              <Tooltip
                cursor={{ fill: isDarkMode ? '#111827' : '#F9FAFB' }}
                contentStyle={{
                  backgroundColor: isDarkMode ? '#111827' : '#FFFFFF',
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  color: isDarkMode ? '#F3F4F6' : '#111827',
                }}
                itemStyle={{ color: isDarkMode ? '#F3F4F6' : '#111827' }}
              />
              <Bar dataKey="minutes" fill="#7C3AED" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tasks Completed */}
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">
          Tasks Completed
        </h3>

        <div className="h-64 w-full min-h-64">
          <ResponsiveContainer width="100%" height={256}>
            <LineChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={gridColor}
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? '#111827' : '#FFFFFF',
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 10px 15px -3px rgb(0, 0, 0, 0.1)',
                  color: isDarkMode ? '#F3F4F6' : '#111827',
                }}
                itemStyle={{ color: isDarkMode ? '#F3F4F6' : '#111827' }}
              />
              <Line
                type="monotone"
                dataKey="tasks"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: '#10B981', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}