'use client';

import { useEffect, useState } from 'react';
import { useTaskStore } from '@/stores/taskStore';
import { Plus, Search, CheckCircle2, Circle, Trash2, GripVertical, ChevronDown, ChevronRight, ListPlus } from 'lucide-react';
import AddTaskModal from '@/components/tasks/AddTaskModal';
import { useSubscription } from '@/hooks/useSubscription';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Task Item Component
function SortableTaskItem({ task, toggleTask, deleteTask, isPro }: any) {
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

export default function TasksPage() {
  const { tasks, fetchTasks, toggleTask, deleteTask, setTasks, updateTaskOrder } = useTaskStore();
  const { isPro } = useSubscription();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchTasks();
  }, []);

  // Keyboard shortcut to open modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'n' && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        e.preventDefault(); // Prevent 'n' from being typed
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

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = filteredTasks.findIndex((t) => t.id === active.id);
      const newIndex = filteredTasks.findIndex((t) => t.id === over.id);
      const newTasks = arrayMove(tasks, oldIndex, newIndex);
      setTasks(newTasks);
      updateTaskOrder(newTasks); // Persist to database
    }
  };

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

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={filteredTasks} strategy={verticalListSortingStrategy}>
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredTasks.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="mx-auto w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">No tasks found.</p>
                  </div>
                ) : (
                  filteredTasks.map((task) => (
                    <SortableTaskItem key={task.id} task={task} toggleTask={toggleTask} deleteTask={deleteTask} isPro={isPro} />
                  ))
                )}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>

      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
