'use client';

import { useEffect, useState } from 'react';
import { useTaskStore } from '@/stores/taskStore';
import { Plus, Search, CheckCircle2, Circle, Trash2, GripVertical } from 'lucide-react';
import AddTaskModal from '@/components/tasks/AddTaskModal';
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
function SortableTaskItem({ task, toggleTask, deleteTask }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="group flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div {...attributes} {...listeners} className="cursor-grab text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400">
        <GripVertical className="w-5 h-5" />
      </div>
      <button onClick={() => toggleTask(task.id)}>
        {task.status === 'completed' ? (
          <CheckCircle2 className="w-6 h-6 text-green-500" />
        ) : (
          <Circle className="w-6 h-6 text-gray-300 dark:text-gray-600" />
        )}
      </button>
      <div className="flex-1">
        <p className={`font-medium ${task.status === 'completed' ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-900 dark:text-gray-100'}`}>
          {task.title}
        </p>
        {task.notes && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{task.notes}</p>}
      </div>
      <div className="flex items-center gap-3">
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
  );
}

export default function TasksPage() {
  const { tasks, fetchTasks, toggleTask, deleteTask, setTasks, updateTaskOrder } = useTaskStore();
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
    <div className="max-w-5xl mx-auto p-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Tasks</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your brain dump and priorities.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg hover:shadow-purple-200 dark:hover:shadow-none"
        >
          <Plus className="w-5 h-5" />
          Add Task
        </button>
      </header>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors duration-300">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-950/50">
          <div className="flex gap-2">
            {['all', 'pending', 'completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold capitalize transition-all ${
                  filter === f 
                    ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors">
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
                  <SortableTaskItem key={task.id} task={task} toggleTask={toggleTask} deleteTask={deleteTask} />
                ))
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
