'use client';

import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  useAuth();
  useSubscription();
  return <>{children}</>;
}
