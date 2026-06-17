'use client';

import { Search } from 'lucide-react';

type PriorityFilterProps = {
  filter: 'all' | 'pending' | 'completed';
  setFilter: (filter: 'all' | 'pending' | 'completed') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

export default function PriorityFilter({ filter, setFilter, searchQuery, setSearchQuery }: PriorityFilterProps) {
  return (
    <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white/50 dark:bg-gray-900/50">
      <div className="flex gap-2">
        {['all', 'pending', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold capitalize transition-all ${
              filter === f 
                ? 'bg-purple-600 text-white shadow-md shadow-purple-200 dark:shadow-none' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors">
        <Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />
        <input 
          type="text" 
          placeholder="Search tasks..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="text-sm outline-none w-40 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400" 
        />
      </div>
    </div>
  );
}
