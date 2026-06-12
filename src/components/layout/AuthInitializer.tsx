'use client';

import { useAuth } from '@/hooks/useAuth';

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  useAuth();
  return <>{children}</>;
}
