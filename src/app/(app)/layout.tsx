import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';
import MobileNav from '@/components/layout/MobileNav';
import UniversalHelpFAB from '@/components/ui/UniversalHelpFAB';
import UpgradeBanner from '@/components/billing/UpgradeBanner';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/sign-in');

  // Fetch profile to check onboarding and Pro status
  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed')
    .eq('user_id', user.id)
    .single();

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('user_id', user.id)
    .single();

  const isPro = subscription?.status === 'active' || subscription?.status === 'trial' || subscription?.status === 'lifetime';

  if (!profile?.onboarding_completed) redirect('/onboarding/step-1');

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background text-foreground transition-colors duration-300">
      <TopNav />
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {!isPro && <UpgradeBanner />}
        <main className="flex-1 overflow-auto relative pb-20 md:pb-0">
          {children}
          <UniversalHelpFAB />
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
