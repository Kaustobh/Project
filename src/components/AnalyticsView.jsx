import React, { useState } from 'react';
import { Sparkles, Calendar, Clock, CheckCircle2, RotateCcw, Award, ArrowRight, HeartHandshake, BarChart3, Moon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CATEGORIES } from '../utils/storage';
import { playSoftClick, playSuccessChime } from '../utils/audio';

export default function AnalyticsView({
  tasks,
  completedSessions,
  reflection,
  setReflection,
  onRolloverTasks,
  soundEnabled,
  darkMode,
  neuCardClass,
  neuInsetClass
}) {
  const [closureModalOpen, setClosureModalOpen] = useState(false);
  const [groundedRating, setGroundedRating] = useState(reflection?.groundedScore || 4);
  const [reflectionText, setReflectionText] = useState(reflection?.qualitativeNotes || '');

  // Calculate metrics
  const totalFocusMinutes = completedSessions * 25;
  const estimatedBaselineMinutes = tasks.reduce((acc, t) => acc + (t.estimatedBlocks || 1) * 25, 0);

  // Category breakdown calculation
  const categoryStats = CATEGORIES.filter(c => c.id !== 'all').map(cat => {
    const catTasks = tasks.filter(t => t.category === cat.id);
    const blocksCompleted = catTasks.reduce((acc, t) => acc + (t.completedBlocks || 0), 0);
    const totalBlocks = catTasks.reduce((acc, t) => acc + (t.estimatedBlocks || 1), 0);
    const percentage = totalBlocks === 0 ? 0 : Math.round((blocksCompleted / Math.max(1, totalBlocks)) * 100);

    return {
      id: cat.id,
      label: cat.label,
      color: cat.color,
      blocksCompleted,
      totalBlocks,
      percentage
    };
  });

  const incompleteTasks = tasks.filter(t => t.status !== 'completed');

  const handleSaveReflection = () => {
    playSoftClick(soundEnabled);
    setReflection(prev => ({
      ...prev,
      groundedScore: groundedRating,
      qualitativeNotes: reflectionText,
      timeInvestedMinutes: totalFocusMinutes
    }));
    playSuccessChime(soundEnabled);
  };

  const handleCompleteClosure = () => {
    playSoftClick(soundEnabled);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
    playSuccessChime(soundEnabled);
    onRolloverTasks();
    setClosureModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl neuCardClass bg-[#5DA8A8]/5 border border-[#5DA8A8]/20">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs font-bold uppercase tracking-wider text-[#5DA8A8]">
            <Moon size={16} /> Daily Decompression
          </div>
          <h2 className="text-2xl font-bold tracking-tight font-display">
            Evening Reflection & Day Closure
          </h2>
          <p className={`text-xs sm:text-sm mt-1 max-w-2xl ${darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
            Review your time invested, balance your life pillars, and close your day with clarity.
          </p>
        </div>

        <button
          onClick={() => {
            playSoftClick(soundEnabled);
            setClosureModalOpen(true);
          }}
          className="px-5 py-3 bg-[#5DA8A8] hover:bg-[#4E9393] text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-md neu-button font-display"
        >
          <Award size={16} /> Close Out Day
        </button>
      </div>

      {/* Analytics KPI Deck */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-2xl ${neuCardClass} space-y-2`}>
          <span className={`text-xs font-semibold uppercase tracking-wider block ${darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
            Deep Focus Invested
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#5DA8A8] font-display">{totalFocusMinutes}m</span>
            <span className="text-xs text-gray-500">of {estimatedBaselineMinutes}m planned</span>
          </div>
          <p className={`text-xs ${darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
            {completedSessions} focus blocks completed today.
          </p>
        </div>

        <div className={`p-6 rounded-2xl ${neuCardClass} space-y-2`}>
          <span className={`text-xs font-semibold uppercase tracking-wider block ${darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
            Time Reclaimed
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-500 font-display">
              {Math.max(30, totalFocusMinutes)}m
            </span>
            <span className="text-xs text-emerald-600 font-medium">Saved via single-tasking</span>
          </div>
          <p className={`text-xs ${darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
            Reduced task-switching fatigue.
          </p>
        </div>

        <div className={`p-6 rounded-2xl ${neuCardClass} space-y-2`}>
          <span className={`text-xs font-semibold uppercase tracking-wider block ${darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
            Grounded Rating
          </span>
          <div className="flex items-center gap-1 text-amber-400 text-2xl font-bold font-display">
            {'★'.repeat(groundedRating)}{'☆'.repeat(5 - groundedRating)}
          </div>
          <p className={`text-xs ${darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
            Self-assessed mental clarity.
          </p>
        </div>
      </div>

      {/* Main Grid: Reflection Card & Category Balance Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 Cols: Qualitative Daily Reflection Card */}
        <div className={`lg:col-span-7 p-6 sm:p-7 rounded-3xl ${neuCardClass} space-y-5`}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-display flex items-center gap-2">
              <HeartHandshake size={20} className="text-[#5DA8A8]" /> Daily Reflection
            </h3>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${neuInsetClass}`}>
              Evening Notes
            </span>
          </div>

          {/* Rating Stars Input */}
          <div>
            <label className={`text-xs font-semibold block mb-2 ${darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
              How grounded did you feel today?
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => {
                    playSoftClick(soundEnabled);
                    setGroundedRating(star);
                  }}
                  className={`w-10 h-10 rounded-xl text-lg font-bold transition neu-button ${
                    groundedRating >= star
                      ? `${neuInsetClass} text-amber-400`
                      : 'opacity-40 hover:opacity-100'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Text Reflection Input */}
          <div>
            <label className={`text-xs font-semibold block mb-2 ${darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
              Reflection Notes (What went well? What can be safely released?)
            </label>
            <textarea
              rows={4}
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              placeholder="e.g. ICU handover went smoothly. Releasing leftover study items until tomorrow morning..."
              className={`w-full p-4 rounded-2xl text-xs font-sans transition focus:outline-none focus:ring-2 focus:ring-[#5DA8A8]/60 ${neuInsetClass}`}
            />
          </div>

          <button
            onClick={handleSaveReflection}
            className="px-5 py-2.5 bg-[#5DA8A8] hover:bg-[#4E9393] text-white text-xs font-semibold rounded-xl transition flex items-center gap-2 shadow-sm neu-button font-display"
          >
            Save Reflection
          </button>
        </div>

        {/* Right 5 Cols: Category Balance Bar Matrix */}
        <div className={`lg:col-span-5 p-6 sm:p-7 rounded-3xl ${neuCardClass} space-y-5`}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-display flex items-center gap-2">
              <BarChart3 size={20} className="text-[#5DA8A8]" /> Life Pillar Balance
            </h3>
          </div>

          <p className={`text-xs ${darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
            Distribution of focus blocks completed across categories.
          </p>

          <div className="space-y-4 pt-2">
            {categoryStats.map(cat => (
              <div key={cat.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span style={{ color: cat.color }}>{cat.label}</span>
                  <span className={darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}>
                    {cat.blocksCompleted} blocks ({cat.percentage}%)
                  </span>
                </div>
                <div className={`w-full h-3 rounded-full overflow-hidden ${neuInsetClass}`}>
                  <div
                    className="h-full transition-all duration-500 rounded-full"
                    style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Day Closure Modal */}
      {closureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className={`max-w-lg w-full p-6 sm:p-7 rounded-3xl ${neuCardClass} shadow-2xl relative space-y-5`}>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold font-display flex items-center gap-2">
                <Moon size={20} className="text-[#5DA8A8]" /> Close Out Day
              </h3>
              <button
                onClick={() => setClosureModalOpen(false)}
                className={`p-1.5 rounded-xl ${neuCardClass} text-xs font-bold`}
              >
                ✕
              </button>
            </div>

            <p className={`text-xs ${darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
              You have {incompleteTasks.length} open items remaining. Carry them forward to tomorrow with a clear mind.
            </p>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {incompleteTasks.map(t => (
                <div key={t.id} className={`p-3 rounded-xl text-xs flex items-center justify-between ${neuInsetClass}`}>
                  <span className="font-semibold truncate max-w-[200px]">{t.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#5DA8A8]/10 text-[#5DA8A8]">
                    Carry Forward
                  </span>
                </div>
              ))}
            </div>

            <div className={`p-4 rounded-2xl text-xs ${neuInsetClass} border border-[#5DA8A8]/30 space-y-1`}>
              <p className="font-bold text-[#5DA8A8]">Closure Principle:</p>
              <p className={darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}>
                "Whatever wasn't completed today was simply not meant for today. Re-anchor tomorrow without regret."
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleCompleteClosure}
                className="w-full py-3 bg-[#5DA8A8] hover:bg-[#4E9393] text-white text-xs font-bold rounded-xl transition neu-button shadow-md font-display"
              >
                Complete Day Closure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
