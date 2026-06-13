import { useSubscription } from '@/hooks/useSubscription';
import React from 'react';

export function ProGuard({ children, fallback }: { children: React.ReactNode, fallback?: React.ReactNode }) {
  const { isPro, isLoading } = useSubscription();
  
  if (isLoading) return null;
  if (!isPro) return fallback || null;
  
  return <>{children}</>;
}
