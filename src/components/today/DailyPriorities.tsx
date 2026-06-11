'use client';

import { useTaskStore } from '@/stores/taskStore';
import { Plus, CheckCircle2, Circle } from 'lucide-react';

export default function DailyPriorities() {
  const { tasks, toggleTask } = useTaskStore();
  const priorities = tasks.filter(t => t.is_daily_priority);

  return (
    <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Daily Priorities</h2>
        <span className="text-sm font-medium text-gray-400">
          {priorities.filter(p => p.status === 'completed').length} / {priorities.length}
        </span>
      </div>

      <div className="space-y-3">
        {priorities.map((task) => (
          <button
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors text-left"
          >
            {task.status === 'completed' ? (
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            ) : (
              <Circle className="w-6 h-6 text-gray-300" />
            )}
            <span className={`flex-1 font-medium ${
              task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900'
            }`}>
              {task.title}
            </span>
          </button>
        ))}

        {priorities.length < 3 && (
          <button className="w-full flex items-center gap-2 p-3 rounded-xl border-2 border-dashed border-gray-100 text-gray-400 hover:border-purple-200 hover:text-purple-600 transition-all">
            <Plus className="w-5 h-5" />
            <span className="text-sm font-semibold">Set a priority</span>
          </button>
        )}
      </div>
    </section>
  );
}
