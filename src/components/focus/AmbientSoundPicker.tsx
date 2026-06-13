'use client';

import { useState, useRef, useEffect } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { Volume2, VolumeX, CloudRain, Wind, Waves, Trees, Coffee, Flame } from 'lucide-react';

const sounds = [
  { id: 'rain', label: 'Rain', icon: CloudRain, url: '/sounds/rain.wav', premium: false },
  { id: 'white_noise', label: 'White Noise', icon: Volume2, url: '/sounds/white_noise.wav', premium: false },
  { id: 'forest', label: 'Forest', icon: Trees, url: '/sounds/forest.wav', premium: true },
  { id: 'ocean', label: 'Ocean', icon: Waves, url: '/sounds/ocean.wav', premium: true },
  { id: 'cafe', label: 'Cafe', icon: Coffee, url: '/sounds/cafe.wav', premium: true },
  { id: 'fire', label: 'Fire', icon: Flame, url: '/sounds/fire.wav', premium: true },
];

export default function AmbientSoundPicker() {
  const [currentSound, setCurrentSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [error, setError] = useState<string | null>(null);
  const { isPro } = useSubscription();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Listen for the custom event to stop sound when timer ends
  useEffect(() => {
    const handleStopSound = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        setCurrentSound(null);
      }
    };

    window.addEventListener('stop-ambient-sound', handleStopSound);
    return () => window.removeEventListener('stop-ambient-sound', handleStopSound);
  }, []);

  const toggleSound = (sound: typeof sounds[0]) => {
    setError(null);
    if (currentSound === sound.id) {
      audioRef.current?.pause();
      setCurrentSound(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = sound.url;
        audioRef.current.play().catch(e => {
          console.error("Playback failed", e);
          setError(`Failed to play ${sound.label}. The source might be blocked or unavailable.`);
          setCurrentSound(null);
        });
        setCurrentSound(sound.id);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 dark:text-gray-100">Ambient Sound</h3>
        {currentSound && (
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input 
              type="range" 
              min="0" max="1" step="0.01" 
              value={volume} 
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl text-[11px] text-red-600 dark:text-red-400 font-medium">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-3">
        {sounds.map((sound) => {
          const isLocked = sound.premium && !isPro;
          const isActive = currentSound === sound.id;
          return (
            <button
              key={sound.id}
              disabled={isLocked}
              onClick={() => toggleSound(sound)}
              className={`p-3 rounded-xl border-2 transition-all text-left relative ${
                isLocked ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:border-purple-200 dark:hover:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/10'
              } ${isActive ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-50 dark:border-gray-800'}`}
            >
              <sound.icon className={`w-5 h-5 mb-2 ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400 dark:text-gray-500'}`} />
              <p className="text-xs font-bold text-gray-900 dark:text-gray-100">{sound.label}</p>
              {isLocked && (
                <span className="absolute top-2 right-2 text-[8px] bg-purple-600 text-white px-1.5 py-0.5 rounded-full font-bold">
                  PRO
                </span>
              )}
            </button>
          );
        })}
      </div>
      <audio ref={audioRef} loop />
    </div>
  );
}
