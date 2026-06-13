'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { Trophy } from 'lucide-react';

export function WinsFeed() {
  const [wins, setWins] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchWins() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('tasks')
        .select('title, completed_at')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(5);

      if (data) setWins(data);
      setIsLoading(false);
    }

    fetchWins();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm mt-8 animate-pulse">
        <div className="h-6 w-32 bg-gray-100 rounded mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-50 rounded-lg"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm mt-8 transition-colors duration-300">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-5 h-5 text-yellow-500" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Recent Wins</h3>
      </div>
      
      <div className="space-y-4">
        {wins.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">No completed tasks yet. Keep going!</p>
        ) : (
          wins.map((win, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg group hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all">
              <span className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-purple-700 dark:group-hover:text-purple-400">{win.title}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {win.completed_at ? formatDistanceToNow(new Date(win.completed_at), { addSuffix: true }) : 'Just now'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
