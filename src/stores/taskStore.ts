import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import { Task } from '@/types';

type TaskStore = {
  tasks: Task[];
  isLoading: boolean;
  fetchTasks: () => Promise<void>;
  addTask: (task: Partial<Task>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
};

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,

  fetchTasks: async () => {
    set({ isLoading: true });
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

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

    await get().updateTask(id, { status: newStatus, completed_at: completedAt });
  },
}));
