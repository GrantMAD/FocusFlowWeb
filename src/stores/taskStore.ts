import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import { Task } from '@/types';
import { createNotification } from '@/lib/notifications';

type TaskStore = {
  tasks: Task[];
  isLoading: boolean;
  fetchTasks: () => Promise<void>;
  addTask: (task: Partial<Task>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  setTasks: (tasks: Task[]) => void;
  updateTaskOrder: (tasks: Task[]) => Promise<void>;
  addChunk: (taskId: string, title: string) => Promise<void>;
  toggleChunk: (taskId: string, chunkId: string) => Promise<void>;
  deleteChunk: (taskId: string, chunkId: string) => Promise<void>;
};

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,

  setTasks: (tasks) => set({ tasks }),

  addChunk: async (taskId, title) => {
    const task = get().tasks.find(t => t.id === taskId);
    if (!task) return;

    const newChunk = { id: Math.random().toString(36).substring(7), title, completed: false };
    const updatedChunks = [...(task.chunks || []), newChunk];

    await get().updateTask(taskId, { chunks: updatedChunks });
  },

  toggleChunk: async (taskId, chunkId) => {
    const task = get().tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedChunks = task.chunks.map(chunk => 
      chunk.id === chunkId ? { ...chunk, completed: !chunk.completed } : chunk
    );

    await get().updateTask(taskId, { chunks: updatedChunks });
  },

  deleteChunk: async (taskId, chunkId) => {
    const task = get().tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedChunks = task.chunks.filter(chunk => chunk.id !== chunkId);
    await get().updateTask(taskId, { chunks: updatedChunks });
  },

  updateTaskOrder: async (tasks) => {
    const supabase = createClient();
    
    // Perform individual updates for each task
    const promises = tasks.map((task, index) => 
      supabase
        .from('tasks')
        .update({ task_order: index })
        .eq('id', task.id)
    );

    const results = await Promise.all(promises);
    const errors = results.filter(r => r.error).map(r => r.error);

    if (errors.length > 0) {
      console.error('Errors updating task order:', errors);
    }
  },

  fetchTasks: async () => {
    set({ isLoading: true });
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('task_order', { ascending: true }); // Changed from order to task_order

    if (data) set({ tasks: data as Task[], isLoading: false });
    else set({ isLoading: false });
  },

  addTask: async (task) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ ...task, user_id: user.id }])
      .select()
      .single();

    if (data) {
      set({ tasks: [data as Task, ...get().tasks] });
    }
  },

  updateTask: async (id, updates) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id);

    if (!error) {
      set({
        tasks: get().tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      });
    }
  },

  deleteTask: async (id) => {
    const supabase = createClient();
    const { error } = await supabase.from('tasks').delete().eq('id', id);

    if (!error) {
      set({ tasks: get().tasks.filter((t) => t.id !== id) });
    }
  },

  toggleTask: async (id) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    const completedAt = newStatus === 'completed' ? new Date().toISOString() : null;

    if (newStatus === 'completed' && task.is_daily_priority) {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await createNotification(
          user.id,
          'Priority Smashed! 💥',
          `You've completed one of your daily priorities: ${task.title}. Keep that momentum!`,
          'task'
        );
      }
    }

    // Check for Clean Sweep (all 'now' tasks completed)
    if (newStatus === 'completed') {
      const remainingNowTasks = get().tasks.filter(t => t.priority === 'now' && t.status !== 'completed' && t.id !== id);
      if (remainingNowTasks.length === 0 && task.priority === 'now') {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await createNotification(
            user.id,
            'Clean Sweep! 🧹',
            'You have finished all your high-priority tasks for today. Outstanding!',
            'success'
          );
        }
      }
    }

    await get().updateTask(id, { status: newStatus, completed_at: completedAt });
  },
}));
