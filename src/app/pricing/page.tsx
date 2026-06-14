'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import Link from 'next/link';

const tiers = [
  {
    name: 'Free',
    price: '$0',
    description: 'Essential focus tools for everyone.',
    features: [
      '3 Daily priorities',
      'Standard focus timer',
      'Basic progress tracking (7 days)',
      'Morning & Evening rituals',
      '2 Ambient sounds',
    ],
    buttonText: 'Get Started',
    premium: false,
  },
  {
    name: 'Pro',
    price: '$9.99',
    interval: '/mo',
    description: 'The ultimate ADHD productivity suite.',
    features: [
      'Unlimited focus sessions',
      'Task chunking & subtasks',
      'Deep Work & Body Doubling modes',
      'Full progress history & insights',
      'All premium ambient sounds',
      'Priority support',
    ],
    buttonText: 'Start 7-day Free Trial',
    premium: true,
  },
];

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAction = (premium: boolean) => {
    if (premium) {
      // Logic for Stripe Checkout would go here
      // For now, redirect to sign-up if not logged in
      router.push('/sign-up');
    } else {
      router.push('/sign-up');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 py-20 px-4 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-gray-900 dark:text-gray-100 mb-6 leading-tight">Simple, honest pricing.</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">Focus on what matters. We'll handle the rest.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {tiers.map((tier) => (
            <div 
              key={tier.name}
              className={`rounded-[2.5rem] p-10 border-2 transition-all duration-500 relative flex flex-col ${
                tier.premium 
                  ? 'border-purple-600 shadow-2xl shadow-purple-200 dark:shadow-none scale-105 bg-white dark:bg-gray-900 z-10' 
                  : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 grayscale opacity-90'
              }`}
            >
              {tier.premium && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 grad-primary text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg">
                  Most Popular
                </div>
              )}
              
              <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-2">{tier.name}</h2>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-5xl font-black text-gray-900 dark:text-gray-100">{tier.price}</span>
                {tier.interval && <span className="text-gray-500 dark:text-gray-400 font-bold">{tier.interval}</span>}
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-10 leading-relaxed">{tier.description}</p>

              <button
                onClick={() => handleAction(tier.premium)}
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all mb-10 text-sm ${
                  tier.premium 
                    ? 'grad-primary text-white hover:scale-[1.02] shadow-xl active:scale-100' 
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'
                }`}
              >
                {tier.buttonText}
              </button>

              <ul className="space-y-5 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    <div className={`mt-0.5 w-6 h-6 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      tier.premium ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'bg-gray-200 dark:bg-gray-800 text-gray-400'
                    }`}>
                      <Check className="w-3.5 h-3.5 stroke-[3px]" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-400 mt-16 font-medium">
          Already have a Pro subscription via our mobile app? 
          <br />
          <Link href="/sign-in" className="text-purple-600 dark:text-purple-400 font-black hover:underline mt-2 inline-block">Sign in to unlock Pro access here</Link>
        </p>
      </div>
    </div>
  );
}
