'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-gray-900 mb-4">Simple, honest pricing.</h1>
          <p className="text-lg text-gray-600">Focus on what matters. We'll handle the rest.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {tiers.map((tier) => (
            <div 
              key={tier.name}
              className={`bg-white rounded-3xl p-8 border-2 transition-all ${
                tier.premium 
                  ? 'border-purple-600 shadow-xl shadow-purple-100 scale-105' 
                  : 'border-gray-100'
              }`}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h2>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-gray-900">{tier.price}</span>
                {tier.interval && <span className="text-gray-500 font-medium">{tier.interval}</span>}
              </div>
              <p className="text-gray-500 text-sm mb-8">{tier.description}</p>

              <button
                onClick={() => handleAction(tier.premium)}
                className={`w-full py-4 rounded-xl font-bold transition-all mb-8 ${
                  tier.premium 
                    ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-200' 
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {tier.buttonText}
              </button>

              <ul className="space-y-4">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-gray-600">
                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      tier.premium ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'
                    }`}>
                      <Check className="w-3 h-3" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-400 mt-12">
          Already have a Pro subscription via our mobile app? 
          <br />
          <Link href="/sign-in" className="text-purple-600 font-bold hover:underline">Sign in</Link> to unlock Pro access here.
        </p>
      </div>
    </div>
  );
}

// Need to import Link
import Link from 'next/link';
