'use client';
import { useEffect } from 'react';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { createClient } from '@/lib/supabase/client';

export function useSubscription() {
  const store = useSubscriptionStore();

  useEffect(() => {
    let unsub: (() => void) | undefined;

    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        store.fetchSubscription(user.id);
        unsub = store.subscribeToChanges(user.id);
      }
    };

    init();

    return () => {
      if (unsub) unsub();
    };
  }, []);

  return { isPro: store.isPro, status: store.status, isLoading: store.isLoading };
}
