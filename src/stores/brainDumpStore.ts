import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import { BrainDumpItem } from '@/types';
import { useTaskStore } from './taskStore';

type BrainDumpStore = {
  items: BrainDumpItem[];
  isLoading: boolean;
  fetchItems: () => Promise<void>;
  addItem: (content: string) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  convertToTask: (id: string, priority: 'now' | 'next' | 'later') => Promise<void>;
};

export const useBrainDumpStore = create<BrainDumpStore>((set, get) => ({
  items: [],
  isLoading: false,

  fetchItems: async () => {
    set({ isLoading: true });
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('brain_dump_items')
      .select('*')
      .eq('user_id', user.id)
      .is('converted_to_task_id', null)
      .order('created_at', { ascending: false });

    if (!error && data) {
      set({ items: data, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },

  addItem: async (content) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const newItem = {
      user_id: user.id,
      content,
      date: new Date().toISOString().split('T')[0],
    };

    const { data, error } = await supabase
      .from('brain_dump_items')
      .insert([newItem])
      .select()
      .single();

    if (!error && data) {
      set((state) => ({ items: [data, ...state.items] }));
    }
  },

  deleteItem: async (id) => {
    const supabase = createClient();
    const { error } = await supabase.from('brain_dump_items').delete().eq('id', id);

    if (!error) {
      set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
    }
  },

  convertToTask: async (id, priority) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const item = get().items.find((i) => i.id === id);
    if (!item) return;

    // 1. Create the task
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .insert([{
        user_id: user.id,
        title: item.content,
        priority: priority,
        status: 'pending',
        is_daily_priority: priority === 'now',
        daily_priority_date: priority === 'now' ? new Date().toISOString().split('T')[0] : null,
      }])
      .select()
      .single();

    if (!taskError && task) {
      // 2. Mark brain dump item as converted
      const { error: updateError } = await supabase
        .from('brain_dump_items')
        .update({ converted_to_task_id: task.id })
        .eq('id', id);

      if (!updateError) {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
        // Refresh the task store so the new task appears immediately
        useTaskStore.getState().fetchTasks();
      }
    }
  },
}));
