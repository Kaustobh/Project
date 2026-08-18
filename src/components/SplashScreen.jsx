import React, { useEffect, useState } from 'react';
import { getAssetPath } from '../utils/asset';

export default function SplashScreen({ darkMode, onComplete }) {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // 1.2s animation timer before triggering completion fade
    const timer = setTimeout(() => {
      setFade(true);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 500); // 500ms fade transition
    }, 1200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-500 bg-noise ${
        fade ? 'opacity-0 pointer-events-none' : 'opacity-100'
      } ${darkMode ? 'bg-[#1A1A1C] text-[#F9F9F7]' : 'bg-[#F9F9F7] text-[#1F2937]'}`}
    >
      {/* Neumorphic Breathing Logo Container with Attached LOGO.png */}
      <div
        className={`w-32 h-32 rounded-3xl flex items-center justify-center mb-6 animate-breathing transition-all p-3.5 overflow-hidden ${
          darkMode
            ? 'bg-[#1A1A1C] shadow-neu-dark border border-[#374151]/40'
            : 'bg-[#F9F9F7] shadow-neu-light border border-[#E5E7EB]/60'
        }`}
      >
        <img
          src={getAssetPath('/LOGO.png')}
          alt="Steady App Logo"
          className="w-full h-full object-contain drop-shadow-md"
        />
      </div>

      {/* Brand Title & Tagline */}
      <h1 className="text-3xl font-bold tracking-tight mb-2 font-display">
        Steady
      </h1>
      <p className={`text-sm tracking-wide ${darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
        One clear step at a time
      </p>

      {/* Subtle Hydration Indicator Bar */}
      <div className="w-36 h-1.5 rounded-full mt-8 overflow-hidden bg-gray-200/50 dark:bg-gray-800/50">
        <div className="h-full bg-[#5DA8A8] animate-pulse rounded-full w-full" />
      </div>
    </div>
  );
}
