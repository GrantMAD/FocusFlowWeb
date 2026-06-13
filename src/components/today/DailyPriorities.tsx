'use client';

import { useState, useEffect } from 'react';
import { useTaskStore } from '@/stores/taskStore';
import { createClient } from '@/lib/supabase/client';
import { Plus, CheckCircle2, Circle } from 'lucide-react';
import AddTaskModal from '@/components/tasks/AddTaskModal';

import { useAuthStore } from '@/stores/authStore';

export default function DailyPriorities() {
  const { tasks, toggleTask, fetchTasks } = useTaskStore();
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const priorities = tasks.filter(t => t.is_daily_priority);

  useEffect(() => {
    if (!user) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`tasks_changes_${user.id}_${Math.random().toString(36).substring(7)}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `user_id=eq.${user.id}`,
      }, () => {
        fetchTasks();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchTasks]);

  return (
    <>
      <section className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Daily Priorities</h2>
          <span className="text-sm font-medium text-gray-400 dark:text-gray-500">
            {priorities.filter(p => p.status === 'completed').length} / {priorities.length}
          </span>
        </div>

        <div className="space-y-3">
          {priorities.map((task) => (
            <button
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
            >
              {task.status === 'completed' ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : (
                <Circle className="w-6 h-6 text-gray-300 dark:text-gray-600" />
              )}
              <span className={`flex-1 font-medium ${
                task.status === 'completed' ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-900 dark:text-gray-100'
              }`}>
                {task.title}
              </span>
            </button>
          ))}

          {priorities.length < 3 && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full flex items-center gap-2 p-3 rounded-xl border-2 border-dashed border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-500 hover:border-purple-200 dark:hover:border-purple-800 hover:text-purple-600 dark:hover:text-purple-400 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span className="text-sm font-semibold">Set a priority</span>
            </button>
          )}
        </div>
      </section>

      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
