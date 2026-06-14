'use client';

import { useEffect, useState } from 'react';
import { User, Coffee, PenTool, Laptop, MessageCircle } from 'lucide-react';

const MESSAGES = [
  "Let's get this done together.",
  "Staying focused...",
  "Making great progress!",
  "We've got this.",
  "Concentrating on the task at hand.",
  "One step at a time.",
  "Doing great, keep it up!",
];

export default function BodyDoublingPresence({ isActive }: { isActive: boolean }) {
  const [message, setMessage] = useState(MESSAGES[0]);
  const [partnerAction, setPartnerAction] = useState<'typing' | 'thinking' | 'writing' | 'drinking'>('thinking');

  useEffect(() => {
    if (!isActive) return;

    const messageInterval = setInterval(() => {
      setMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
    }, 15000);

    const actionInterval = setInterval(() => {
      const actions: ('typing' | 'thinking' | 'writing' | 'drinking')[] = ['typing', 'thinking', 'writing', 'drinking'];
      setPartnerAction(actions[Math.floor(Math.random() * actions.length)]);
    }, 8000);

    return () => {
      clearInterval(messageInterval);
      clearInterval(actionInterval);
    };
  }, [isActive]);

  return (
    <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-gray-900 shadow-2xl border-4 border-purple-500/20 group">
      {/* Simulated Video Feed Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-950 flex items-center justify-center">
        <div className="relative flex flex-col items-center">
          {/* Partner Silhouette/Avatar */}
          <div className="w-32 h-32 rounded-full bg-purple-900/40 flex items-center justify-center mb-4 animate-pulse">
            <User className="w-16 h-16 text-purple-400" />
          </div>
          
          {/* Action Indicator */}
          <div className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
            {partnerAction === 'typing' && <Laptop className="w-4 h-4 text-purple-400 animate-bounce" />}
            {partnerAction === 'thinking' && <BrainIcon className="w-4 h-4 text-blue-400" />}
            {partnerAction === 'writing' && <PenTool className="w-4 h-4 text-green-400 animate-pulse" />}
            {partnerAction === 'drinking' && <Coffee className="w-4 h-4 text-orange-400" />}
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">
              Partner is {partnerAction}...
            </span>
          </div>
        </div>
      </div>

      {/* Overlay UI */}
      <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
        <div className="flex justify-between items-start">
          <div className="px-3 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full animate-pulse flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-white rounded-full" /> LIVE SESSION
          </div>
          <div className="text-white/40 text-[10px] font-mono">0.0.1_SIMULATED_PRESENCE</div>
        </div>

        {/* Chat Bubble */}
        <div className="max-w-[70%] animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl rounded-bl-none flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex-shrink-0 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white text-xs font-medium leading-relaxed italic">
                "{message}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%]" />
    </div>
  );
}

function BrainIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.54Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.54Z" />
    </svg>
  );
}
