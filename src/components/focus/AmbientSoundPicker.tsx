'use client';

import { useState, useRef, useEffect } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { Volume2, VolumeX, CloudRain, Wind, Waves, Trees } from 'lucide-react';

const sounds = [
  { id: 'rain', label: 'Rain', icon: CloudRain, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', premium: false }, // Placeholder URLs
  { id: 'white_noise', label: 'White Noise', icon: Volume2, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', premium: false },
  { id: 'forest', label: 'Forest', icon: Trees, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', premium: true },
  { id: 'ocean', label: 'Ocean', icon: Waves, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', premium: true },
];

export default function AmbientSoundPicker() {
  const [currentSound, setCurrentSound] = useState<string | null>(null);
  const { isPro } = useSubscription();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleSound = (sound: typeof sounds[0]) => {
    if (currentSound === sound.id) {
      audioRef.current?.pause();
      setCurrentSound(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = sound.url;
        audioRef.current.play();
        setCurrentSound(sound.id);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h3 className="font-bold text-gray-900 mb-4">Ambient Sound</h3>
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
                isLocked ? 'opacity-50 grayscale' : 'hover:border-purple-200 hover:bg-purple-50'
              } ${isActive ? 'border-purple-600 bg-purple-50' : 'border-gray-50'}`}
            >
              <sound.icon className={`w-5 h-5 mb-2 ${isActive ? 'text-purple-600' : 'text-gray-400'}`} />
              <p className="text-xs font-bold text-gray-900">{sound.label}</p>
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
