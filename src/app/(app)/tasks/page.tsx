'use client';

import { useEffect, useState } from 'react';
import { useTaskStore } from '@/stores/taskStore';
import { Plus } from 'lucide-react';
import AddTaskModal from '@/components/tasks/AddTaskModal';
import { useSubscription } from '@/hooks/useSubscription';
import PriorityFilter from '@/components/tasks/PriorityFilter';
import TaskList from '@/components/tasks/TaskList';

export default function TasksPage() {
  const { tasks, fetchTasks, toggleTask, deleteTask } = useTaskStore();
  const { isPro } = useSubscription();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Keyboard shortcut to open modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'n' && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredTasks = tasks.filter(t => {
    const matchesFilter = filter === 'all' || t.status === filter;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (t.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-full">
      {/* Hero Header */}
      <div className="grad-primary pt-12 pb-24 px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-white">Tasks</h1>
            <p className="text-purple-100 font-medium">Manage your brain dump and priorities.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-xl font-bold hover:bg-purple-50 transition-all shadow-xl scale-105 active:scale-100"
          >
            <Plus className="w-5 h-5" />
            Add Task
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 -mt-16 pb-12">
        <div className="glass-card rounded-2xl shadow-xl overflow-hidden transition-colors duration-300">
          <PriorityFilter 
            filter={filter} 
            setFilter={setFilter} 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
          />

          <TaskList 
            tasks={filteredTasks} 
            toggleTask={toggleTask} 
            deleteTask={deleteTask} 
            isPro={isPro} 
          />
        </div>
      </div>

      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
