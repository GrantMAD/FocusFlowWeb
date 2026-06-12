'use client';

import dynamic from 'next/dynamic';

interface WeeklyChartData {
  day: string;
  minutes: number;
  tasks: number;
}

interface WeeklyChartWrapperProps {
  data: WeeklyChartData[];
}

const WeeklyChart = dynamic(
  () =>
    import('@/components/progress/WeeklyChart').then(
      (mod) => mod.WeeklyChart
    ),
  {
    ssr: false,
  }
);

export default function WeeklyChartWrapper({
  data,
}: WeeklyChartWrapperProps) {
  return <WeeklyChart data={data} />;
}