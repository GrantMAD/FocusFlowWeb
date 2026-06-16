import { createClient } from '@/lib/supabase/client';

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'task' | 'streak';

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: NotificationType = 'info',
  link: string | null = null
) {
  const supabase = createClient();
  const { error } = await supabase
    .from('notifications')
    .insert([{
      user_id: userId,
      title,
      message,
      type,
      link,
      is_read: false,
    }]);

  if (error) {
    console.error('Error creating notification:', error);
  }
}
