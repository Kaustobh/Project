import React from 'react';
import { Play, Pause, RotateCcw, Clock, Sparkles, CheckCircle, Coffee } from 'lucide-react';
import { playSoftClick, playSuccessChime } from '../utils/audio';

export default function SteadyTimerWidget({
  timerSeconds,
  isTimerRunning,
  setIsTimerRunning,
  timerMode,
  setTimerMode,
  setTimerSeconds,
  completedSessions,
  activeTask,
  onCompleteBlock,
  soundEnabled,
  darkMode,
  neuCardClass,
  neuInsetClass
}) {
  const totalSeconds = timerMode === 'focus' ? 25 * 60 : 5 * 60;
  const progressPercent = Math.min(100, Math.max(0, ((totalSeconds - timerSeconds) / totalSeconds) * 100));

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleReset = () => {
    playSoftClick(soundEnabled);
    setIsTimerRunning(false);
    setTimerSeconds(timerMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const toggleTimer = () => {
    playSoftClick(soundEnabled);
    setIsTimerRunning(!isTimerRunning);
  };

  const switchMode = (mode) => {
    playSoftClick(soundEnabled);
    setIsTimerRunning(false);
    setTimerMode(mode);
    setTimerSeconds(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  return (
    <div className={`p-6 rounded-2xl ${neuCardClass} flex flex-col items-center text-center relative overflow-hidden`}>
      {/* Decorative calm background gradient accent */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[#5DA8A8]/10 blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between w-full mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#5DA8A8] flex items-center gap-1.5 font-display">
          <Clock size={15} /> Steady Session
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => switchMode('focus')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all neu-button ${
              timerMode === 'focus' ? `${neuInsetClass} text-[#5DA8A8] font-bold` : 'opacity-70 hover:opacity-100'
            }`}
          >
            Deep Focus
          </button>
          <button
            onClick={() => switchMode('break')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all neu-button ${
              timerMode === 'break' ? `${neuInsetClass} text-[#5DA8A8] font-bold` : 'opacity-70 hover:opacity-100'
            }`}
          >
            Restoration
          </button>
        </div>
      </div>

      {/* Circular Inset Dial with SVG Progress Ring */}
      <div className="relative my-4 flex items-center justify-center">
        {/* SVG Outer Circle Progress */}
        <svg className="w-52 h-52 transform -rotate-90">
          <circle
            cx="104"
            cy="104"
            r="92"
            stroke="currentColor"
            strokeWidth="8"
            className={darkMode ? 'text-[#212123]' : 'text-[#E5E7EB]'}
            fill="transparent"
          />
          <circle
            cx="104"
            cy="104"
            r="92"
            stroke="#5DA8A8"
            strokeWidth="8"
            strokeDasharray={578}
            strokeDashoffset={578 - (578 * progressPercent) / 100}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
            fill="transparent"
          />
        </svg>

        {/* Center Neumorphic Inset Circle */}
        <div className={`absolute w-44 h-44 rounded-full ${neuInsetClass} flex flex-col items-center justify-center p-4`}>
          <span className="text-4xl font-bold tracking-tight font-display">
            {formatTime(timerSeconds)}
          </span>
          <span className={`text-xs mt-1 font-medium ${darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
            {timerMode === 'focus' ? 'Focus Block (25m)' : 'Soft Break (5m)'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={handleReset}
          className={`p-3 rounded-xl transition ${neuCardClass} hover:text-[#5DA8A8] neu-button`}
          title="Reset Timer"
        >
          <RotateCcw size={18} />
        </button>

        <button
          onClick={toggleTimer}
          className="px-6 py-3 bg-[#5DA8A8] hover:bg-[#4E9393] text-white font-semibold text-sm rounded-xl transition flex items-center gap-2 shadow-sm neu-button"
        >
          {isTimerRunning ? <Pause size={18} /> : <Play size={18} />}
          {isTimerRunning ? 'Pause Flow' : 'Begin Focus'}
        </button>
      </div>

      {/* Active Focus Task Context Box */}
      {activeTask && (
        <div className={`mt-6 w-full p-3.5 rounded-xl text-left text-xs ${neuInsetClass} border border-[#5DA8A8]/20`}>
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-[#5DA8A8] flex items-center gap-1">
              <Sparkles size={12} /> Active Task:
            </span>
            <span className="text-[10px] opacity-70">
              {activeTask.completedBlocks} of {activeTask.estimatedBlocks} blocks done
            </span>
          </div>
          <p className="font-medium truncate mb-1">{activeTask.title}</p>
          <p className={`text-[11px] truncate ${darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
            {activeTask.notes || 'No extra notes provided.'}
          </p>
        </div>
      )}
    </div>
  );
}
