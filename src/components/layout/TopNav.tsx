'use client';

import NotificationBell from './NotificationBell';
import AvatarImage from '@/components/ui/AvatarImage';
import { useAuthStore } from '@/stores/authStore';

export default function TopNav() {
  const { profile, user } = useAuthStore();
  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'User';

  return (
    <header className="md:hidden sticky top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 px-6 py-4 z-40 flex justify-between items-center">
      <h1 className="text-xl font-black text-grad">FocusFlow</h1>
      
      <div className="flex items-center gap-4">
        <NotificationBell />
        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-700 dark:text-purple-400 font-bold uppercase text-xs overflow-hidden">
          {profile?.avatar_url ? (
            <AvatarImage src={profile.avatar_url} fallback={displayName[0]} />
          ) : (
            <span>{displayName[0]}</span>
          )}
        </div>
      </div>
    </header>
  );
}
