'use client';

import { Zap, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function UpgradeBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-purple-600 text-white px-6 py-3 flex items-center justify-between shadow-lg animate-in slide-in-from-top duration-500">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
          <Zap className="w-4 h-4 fill-white" />
        </div>
        <div>
          <p className="text-sm font-bold">Unlock FocusFlow Pro</p>
          <p className="text-[10px] text-purple-100 font-medium">Get task chunking, unlimited focus sounds, and more.</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Link 
          href="/pricing" 
          className="bg-white text-purple-600 px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider hover:bg-purple-50 transition-all"
        >
          Upgrade Now
        </Link>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-purple-200 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
