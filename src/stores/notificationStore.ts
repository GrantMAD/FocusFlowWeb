import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import { Notification } from '@/types';

type NotificationStore = {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  subscribeToNotifications: (userId: string) => () => void;
};

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      set({ 
        notifications: data as Notification[],
        unreadCount: data.filter(n => !n.is_read).length,
        isLoading: false 
      });
    } else {
      set({ isLoading: false });
    }
  },

  markAsRead: async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    if (!error) {
      const newNotifications = get().notifications.map(n => 
        n.id === id ? { ...n, is_read: true } : n
      );
      set({ 
        notifications: newNotifications,
        unreadCount: newNotifications.filter(n => !n.is_read).length 
      });
    }
  },

  markAllAsRead: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.rpc('mark_all_notifications_read', { p_user_id: user.id });

    if (!error) {
      const newNotifications = get().notifications.map(n => ({ ...n, is_read: true }));
      set({ 
        notifications: newNotifications,
        unreadCount: 0 
      });
    }
  },

  deleteNotification: async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);

    if (!error) {
      const newNotifications = get().notifications.filter(n => n.id !== id);
      set({ 
        notifications: newNotifications,
        unreadCount: newNotifications.filter(n => !n.is_read).length 
      });
    }
  },

  subscribeToNotifications: (userId: string) => {
    const supabase = createClient();
    
    // Create a unique channel name to avoid conflicts if multiple subscriptions are attempted
    const channelId = `notifications_${userId}_${Date.now()}`;
    
    const channel = supabase
      .channel(channelId)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      }, () => {
        get().fetchNotifications();
      });

    // CRITICAL: Call subscribe() AFTER all .on() listeners are attached
    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
}));
