'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PricingCard from '@/components/billing/PricingCard';
import { ArrowLeft } from 'lucide-react';

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
  const router = useRouter();

  const handleAction = (premium: boolean) => {
    // Logic for Stripe Checkout would go here
    // For now, redirect to sign-up if not logged in
    router.push('/sign-up');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 py-20 px-4 transition-colors duration-300 relative">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="md:absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-purple-600 font-bold transition-all group mb-8 md:mb-0"
        >
          <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 group-hover:border-purple-200 dark:group-hover:border-purple-900 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-sm">Back to App</span>
        </button>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-gray-900 dark:text-gray-100 mb-6 leading-tight">Simple, honest pricing.</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">Focus on what matters. We'll handle the rest.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {tiers.map((tier) => (
            <PricingCard key={tier.name} tier={tier} onAction={handleAction} />
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
