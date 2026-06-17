'use client';

import { Check } from 'lucide-react';

type PricingCardProps = {
  tier: {
    name: string;
    price: string;
    interval?: string;
    description: string;
    features: string[];
    buttonText: string;
    premium: boolean;
  };
  onAction: (premium: boolean) => void;
};

export default function PricingCard({ tier, onAction }: PricingCardProps) {
  return (
    <div 
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
        onClick={() => onAction(tier.premium)}
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
  );
}
