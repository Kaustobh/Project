import React from 'react';
import { Sun, Moon, Volume2, VolumeX, Plus } from 'lucide-react';
import { playSoftClick } from '../utils/audio';
import { getAssetPath } from '../utils/asset';

export default function Navbar({
  darkMode,
  setDarkMode,
  soundEnabled,
  setSoundEnabled,
  onOpenNewTask,
  onReplaySplash,
  neuCardClass
}) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4 sticky top-0 z-30 backdrop-blur-md bg-opacity-90 transition-colors">
      {/* Brand & Grounding Greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            playSoftClick(soundEnabled);
            onReplaySplash();
          }}
          className={`w-11 h-11 rounded-2xl p-1.5 flex items-center justify-center transition-transform hover:scale-105 neu-button overflow-hidden ${neuCardClass}`}
          title="Replay Splash Screen"
        >
          <img src={getAssetPath('/LOGO.png')} alt="Steady Logo" className="w-full h-full object-contain" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight font-display">Steady</h1>
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${darkMode ? 'bg-[#374151]/50 text-[#5DA8A8]' : 'bg-[#EBF5F5] text-[#5DA8A8]'}`}>
              {todayFormatted}
            </span>
          </div>
          <p className={`text-xs ${darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'} flex items-center gap-1`}>
            <span>{getGreeting()}, Lakshay</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#5DA8A8] animate-pulse"></span>
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick New Task Button */}
        <button
          onClick={() => {
            playSoftClick(soundEnabled);
            onOpenNewTask();
          }}
          className="px-3.5 py-2.5 bg-[#5DA8A8] hover:bg-[#4E9393] text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5 shadow-sm neu-button"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">New Task</span>
        </button>

        {/* Audio FX Toggle */}
        <button
          onClick={() => {
            const nextState = !soundEnabled;
            setSoundEnabled(nextState);
            playSoftClick(nextState);
          }}
          className={`p-2.5 rounded-xl transition-all ${neuCardClass} hover:text-[#5DA8A8] neu-button`}
          aria-label="Toggle Sound Effects"
          title={soundEnabled ? "Mute Tactile Sound" : "Enable Tactile Sound"}
        >
          {soundEnabled ? <Volume2 size={18} className="text-[#5DA8A8]" /> : <VolumeX size={18} className="opacity-50" />}
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => {
            playSoftClick(soundEnabled);
            setDarkMode(!darkMode);
          }}
          className={`p-2.5 rounded-xl transition-all ${neuCardClass} hover:text-[#5DA8A8] neu-button`}
          aria-label="Toggle Dark Mode"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
