'use client';
import { useEffect } from 'react';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { createClient } from '@/lib/supabase/client';

export function useSubscription() {
  const store = useSubscriptionStore();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        store.fetchSubscription(user.id);
        const unsub = store.subscribeToChanges(user.id);
        return unsub;
      }
    });
  }, []);

  return { isPro: store.isPro, status: store.status, isLoading: store.isLoading };
}
