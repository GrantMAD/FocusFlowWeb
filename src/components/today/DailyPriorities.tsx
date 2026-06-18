'use client';

import { useState, useEffect } from 'react';
import { useTaskStore } from '@/stores/taskStore';
import { createClient } from '@/lib/supabase/client';
import { Plus, CheckCircle2, Circle, Star, ChevronDown, ChevronRight } from 'lucide-react';
import AddTaskModal from '@/components/tasks/AddTaskModal';

import { useAuthStore } from '@/stores/authStore';
import { useSubscriptionStore } from '@/stores/subscriptionStore';

export default function DailyPriorities() {
  const { tasks, toggleTask, fetchTasks, toggleChunk } = useTaskStore();
  const { user, completeOnboardingStep } = useAuthStore();
  const { isPro } = useSubscriptionStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});

  const priorities = tasks.filter(t => t.is_daily_priority);

  const toggleExpand = (taskId: string) => {
    setExpandedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  useEffect(() => {
    const updatePrioritiesSet = async () => {
      if (!user || priorities.length === 0) return;
      
      const supabase = createClient();
      await supabase
        .from('daily_logs')
        .update({ daily_priorities_set: true })
        .eq('user_id', user.id)
        .eq('date', new Date().toISOString().split('T')[0]);

      completeOnboardingStep('priorities');
    };

    updatePrioritiesSet();
  }, [priorities.length, user]);

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
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-purple-600 dark:text-purple-400 fill-purple-600 dark:fill-purple-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Daily Priorities</h2>
          </div>
          <span className="text-sm font-medium text-gray-400 dark:text-gray-500">
            {priorities.filter(p => p.status === 'completed').length} / {priorities.length}
          </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">The 3 most important things you need to do today.</p>

        <div className="space-y-3">
          {priorities.map((task) => {
            const hasChunks = task.chunks && task.chunks.length > 0;
            const completedChunks = task.chunks?.filter(c => c.completed).length || 0;
            const totalChunks = task.chunks?.length || 0;
            const isExpanded = expandedTasks[task.id];

            return (
              <div key={task.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="flex-1 flex items-center gap-3 p-3 rounded-xl border border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-300 dark:text-gray-600 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium truncate ${
                          task.status === 'completed' ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-900 dark:text-gray-100'
                        }`}>
                          {task.title}
                        </span>
                        {isPro && hasChunks && (
                          <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-1.5 py-0.5 rounded-full shrink-0">
                            {completedChunks}/{totalChunks}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                  {isPro && hasChunks && (
                    <button 
                      onClick={() => toggleExpand(task.id)}
                      className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                    >
                      {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </button>
                  )}
                </div>

                {/* Subtasks in Daily Priorities */}
                {isExpanded && isPro && hasChunks && (
                  <div className="pl-12 pr-4 pb-2 space-y-2 animate-in slide-in-from-top-1 duration-200">
                    {task.chunks.map((chunk) => (
                      <div key={chunk.id} className="flex items-center gap-3">
                        <button onClick={() => toggleChunk(task.id, chunk.id)}>
                          {chunk.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : (
                            <Circle className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                          )}
                        </button>
                        <span className={`text-sm ${chunk.completed ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-300'}`}>
                          {chunk.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

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
