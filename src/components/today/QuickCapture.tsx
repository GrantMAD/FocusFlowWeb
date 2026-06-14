'use client';

import { useState, useEffect, useRef } from 'react';
import { useBrainDumpStore } from '@/stores/brainDumpStore';
import { Plus, Trash2, Brain, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/authStore';

export default function QuickCapture() {
  const { items, fetchItems, addItem, deleteItem, convertToTask } = useBrainDumpStore();
  const { user } = useAuthStore();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBrainDumpDone, setIsBrainDumpDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchItems();
    fetchBrainDumpStatus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'q' && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fetchBrainDumpStatus = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: log } = await supabase.rpc('get_or_create_daily_log', { p_user_id: user.id });
    if (log) {
      setIsBrainDumpDone(log.brain_dump_completed);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    await addItem(content.trim());

    // Update brain_dump_completed in daily_logs
    if (user && !isBrainDumpDone) {
      const supabase = createClient();
      await supabase
        .from('daily_logs')
        .update({ brain_dump_completed: true })
        .eq('user_id', user.id)
        .eq('date', new Date().toISOString().split('T')[0]);
      setIsBrainDumpDone(true);
    }

    setContent('');
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors duration-300">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-purple-50/30 dark:bg-purple-900/10">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h3 className="font-bold text-gray-900 dark:text-gray-100">Brain Dump</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="relative">
          <input
            ref={inputRef}
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind? (Press 'Q')"
            className="w-full pl-4 pr-12 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
          />
          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="absolute right-2 top-1.5 p-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-all"
          >
            <Plus className="w-5 h-5" />
          </button>
        </form>
        <p className="mt-2 text-[10px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider">
          Quickly capture thoughts to clear your head.
        </p>
      </div>

      <div className="divide-y divide-gray-50 dark:divide-gray-800 max-h-[400px] overflow-auto">
        {items.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-400 dark:text-gray-500 italic">Clear mind, focused heart.</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="group p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
              <p className="text-sm text-gray-800 dark:text-gray-200 mb-3">{item.content}</p>
              <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all">
                <div className="flex gap-1">
                  {(['now', 'next', 'later'] as const).map((priority) => (
                    <button
                      key={priority}
                      onClick={() => convertToTask(item.id, priority)}
                      className="px-2 py-1 text-[10px] font-bold uppercase tracking-tighter bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:border-purple-300 dark:hover:border-purple-600 hover:text-purple-600 dark:hover:text-purple-400 rounded-md transition-all"
                    >
                      {priority}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="p-1.5 text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
