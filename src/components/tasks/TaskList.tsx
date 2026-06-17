'use client';

import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { CheckCircle2 } from 'lucide-react';
import TaskCard from './TaskCard';
import { useTaskStore } from '@/stores/taskStore';

type TaskListProps = {
  tasks: any[];
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  isPro: boolean;
};

export default function TaskList({ tasks, toggleTask, deleteTask, isPro }: TaskListProps) {
  const { setTasks, updateTaskOrder } = useTaskStore();
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = tasks.findIndex((t) => t.id === active.id);
      const newIndex = tasks.findIndex((t) => t.id === over.id);
      const newTasks = arrayMove(tasks, oldIndex, newIndex);
      setTasks(newTasks);
      updateTaskOrder(newTasks);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="mx-auto w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-gray-300 dark:text-gray-600" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium">No tasks found.</p>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {tasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              toggleTask={toggleTask} 
              deleteTask={deleteTask} 
              isPro={isPro} 
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
