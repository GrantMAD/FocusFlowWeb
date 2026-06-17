'use client';

import { useState } from 'react';
import { useTaskStore } from '@/stores/taskStore';
import { GripVertical, ChevronDown, ChevronRight, CheckCircle2, Circle, ListPlus, Trash2, Plus } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type TaskCardProps = {
  task: any;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  isPro: boolean;
};

export default function TaskCard({ task, toggleTask, deleteTask, isPro }: TaskCardProps) {
  const { toggleChunk, addChunk, deleteChunk } = useTaskStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [newChunkTitle, setNewChunkTitle] = useState('');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleAddChunk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChunkTitle.trim()) return;
    addChunk(task.id, newChunkTitle.trim());
    setNewChunkTitle('');
  };

  const completedChunks = task.chunks?.filter((c: any) => c.completed).length || 0;
  const totalChunks = task.chunks?.length || 0;

  return (
    <div ref={setNodeRef} style={style} className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
      <div className="group flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
        <div {...attributes} {...listeners} className="cursor-grab text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400">
          <GripVertical className="w-5 h-5" />
        </div>
        
        {isPro && totalChunks > 0 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-purple-600 transition-colors"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        )}

        <button onClick={() => toggleTask(task.id)}>
          {task.status === 'completed' ? (
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          ) : (
            <Circle className="w-6 h-6 text-gray-300 dark:text-gray-600" />
          )}
        </button>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className={`font-medium ${task.status === 'completed' ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-900 dark:text-gray-100'}`}>
              {task.title}
            </p>
            {isPro && totalChunks > 0 && (
              <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-1.5 py-0.5 rounded-full">
                {completedChunks}/{totalChunks}
              </span>
            )}
          </div>
          {task.notes && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{task.notes}</p>}
        </div>

        <div className="flex items-center gap-3">
          {isPro && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all"
              title="Add subtasks"
            >
              <ListPlus className="w-4 h-4" />
            </button>
          )}
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            task.priority === 'now' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
            task.priority === 'next' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' :
            'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
          }`}>
            {task.priority}
          </span>
          <button
            onClick={() => deleteTask(task.id)}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Subtasks Section */}
      {isExpanded && isPro && (
        <div className="pl-16 pr-8 pb-4 space-y-2 animate-in slide-in-from-top-1 duration-200">
          <div className="space-y-1">
            {task.chunks?.map((chunk: any) => (
              <div key={chunk.id} className="flex items-center gap-3 group/chunk">
                <button onClick={() => toggleChunk(task.id, chunk.id)}>
                  {chunk.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                  )}
                </button>
                <span className={`text-sm flex-1 ${chunk.completed ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-300'}`}>
                  {chunk.title}
                </span>
                <button 
                  onClick={() => deleteChunk(task.id, chunk.id)}
                  className="opacity-0 group-hover/chunk:opacity-100 p-1 text-gray-300 hover:text-red-500 transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          
          <form onSubmit={handleAddChunk} className="flex gap-2 mt-2">
            <input
              type="text"
              placeholder="Add a subtask..."
              value={newChunkTitle}
              onChange={(e) => setNewChunkTitle(e.target.value)}
              className="flex-1 text-xs bg-gray-50 dark:bg-gray-800 border-none rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-purple-500 outline-none text-gray-900 dark:text-gray-100"
            />
            <button 
              type="submit"
              disabled={!newChunkTitle.trim()}
              className="p-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-all"
            >
              <Plus className="w-3 h-3" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
