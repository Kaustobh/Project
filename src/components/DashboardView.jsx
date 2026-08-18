import React from 'react';
import { Sparkles, Play, CheckCircle2, Circle, ChevronRight, Plus } from 'lucide-react';
import { CATEGORIES } from '../utils/storage';
import { playSoftClick } from '../utils/audio';
import SteadyTimerWidget from './SteadyTimerWidget';

export default function DashboardView({
  tasks,
  activeTask,
  setActiveTask,
  activeCategory,
  setActiveCategory,
  onToggleSubtask,
  onOpenTaskModal,
  onOpenNewTask,
  timerSeconds,
  isTimerRunning,
  setIsTimerRunning,
  timerMode,
  setTimerMode,
  setTimerSeconds,
  completedSessions,
  soundEnabled,
  darkMode,
  neuCardClass,
  neuInsetClass
}) {
  const filteredTasks = activeCategory === 'all'
    ? tasks
    : tasks.filter(t => t.category === activeCategory);

  // Compute live KPIs
  const timeReclaimedMinutes = completedSessions * 25;
  const totalSubtasksCount = tasks.reduce((acc, t) => acc + t.subtasks.length, 0);
  const completedSubtasksCount = tasks.reduce((acc, t) => acc + t.subtasks.filter(s => s.done).length, 0);
  const completionRate = totalSubtasksCount === 0 ? 0 : Math.round((completedSubtasksCount / totalSubtasksCount) * 100);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 7 Cols: Hero "One Next Step" + KPI Grid + Category Filters + Task Horizon */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Hero "One Next Step" Focus Card with attached logo.jpeg accent */}
          <div className={`p-6 sm:p-7 rounded-3xl ${neuCardClass} border-l-4 border-l-[#5DA8A8] relative overflow-hidden group`}>
            {/* Background Graphic Accent using logo.jpeg */}
            <div className="absolute right-0 top-0 bottom-0 w-48 opacity-10 dark:opacity-15 pointer-events-none transition-opacity group-hover:opacity-20">
              <img src="/logo.jpeg" alt="Logo Watermark" className="w-full h-full object-cover" />
            </div>

            <div className="flex items-center justify-between mb-3 relative z-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5DA8A8] flex items-center gap-1.5 font-display">
                <Sparkles size={15} /> Current Anchor — One Next Step
              </span>
              {activeTask && (
                <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${neuInsetClass}`}>
                  {activeTask.category}
                </span>
              )}
            </div>

            {activeTask ? (
              <div className="relative z-10">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2 font-display">
                  {activeTask.title}
                </h2>
                <p className={`text-xs sm:text-sm mb-5 ${darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                  {activeTask.subtasks.filter(s => s.done).length} of {activeTask.subtasks.length} subtasks completed • Priority: {activeTask.priority}
                </p>

                <div className="flex items-center flex-wrap gap-3">
                  <button
                    onClick={() => {
                      playSoftClick(soundEnabled);
                      setIsTimerRunning(true);
                    }}
                    className="px-5 py-2.5 bg-[#5DA8A8] hover:bg-[#4E9393] text-white text-xs font-semibold rounded-xl transition flex items-center gap-2 shadow-sm neu-button"
                  >
                    <Play size={16} /> Begin Steady Session
                  </button>
                  
                  <button
                    onClick={() => {
                      playSoftClick(soundEnabled);
                      onOpenTaskModal(activeTask);
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-medium transition ${neuCardClass} hover:text-[#5DA8A8] neu-button`}
                  >
                    View Details & Notes
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 relative z-10">
                <p className={`text-sm mb-4 ${darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                  No active anchor selected for today.
                </p>
                <button
                  onClick={() => {
                    playSoftClick(soundEnabled);
                    onOpenNewTask();
                  }}
                  className="px-4 py-2 bg-[#5DA8A8] text-white text-xs font-semibold rounded-xl neu-button"
                >
                  Create First Task
                </button>
              </div>
            )}
          </div>

          {/* Metric KPI Deck (Neumorphic Cards with KPI_1.jpeg, KPI_2.jpeg, KPI_3.jpeg) */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            
            {/* KPI 1 Card */}
            <div className={`p-4 rounded-2xl text-center ${neuCardClass} relative overflow-hidden transition hover:scale-[1.02]`}>
              <div className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none">
                <img src="/KPI_1.jpeg" alt="KPI 1 Graphic" className="w-full h-full object-cover" />
              </div>
              <div className="relative z-10">
                <span className={`text-[11px] block font-medium mb-1 ${darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                  Time Reclaimed
                </span>
                <span className="text-xl sm:text-2xl font-bold text-[#5DA8A8] font-display">
                  {timeReclaimedMinutes}m
                </span>
              </div>
            </div>

            {/* KPI 2 Card */}
            <div className={`p-4 rounded-2xl text-center ${neuCardClass} relative overflow-hidden transition hover:scale-[1.02]`}>
              <div className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none">
                <img src="/KPI_2.jpeg" alt="KPI 2 Graphic" className="w-full h-full object-cover" />
              </div>
              <div className="relative z-10">
                <span className={`text-[11px] block font-medium mb-1 ${darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                  Active Flow
                </span>
                <span className="text-xl sm:text-2xl font-bold font-display">
                  {completedSessions} <span className="text-xs font-normal opacity-70">blocks</span>
                </span>
              </div>
            </div>

            {/* KPI 3 Card */}
            <div className={`p-4 rounded-2xl text-center ${neuCardClass} relative overflow-hidden transition hover:scale-[1.02]`}>
              <div className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none">
                <img src="/KPI_3.jpeg" alt="KPI 3 Graphic" className="w-full h-full object-cover" />
              </div>
              <div className="relative z-10">
                <span className={`text-[11px] block font-medium mb-1 ${darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                  Completion Rate
                </span>
                <span className="text-xl sm:text-2xl font-bold text-emerald-500 font-display">
                  {completionRate}%
                </span>
              </div>
            </div>

          </div>

          {/* Category Quick-Filter Ribbon */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    playSoftClick(soundEnabled);
                    setActiveCategory(cat.id);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap neu-button ${
                    isActive
                      ? `${neuInsetClass} text-[#5DA8A8]`
                      : neuCardClass
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-[#5DA8A8]' : 'opacity-60'} />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Today's Task Horizon Header */}
          <div className="flex items-center justify-between pt-2">
            <h3 className="text-lg font-bold tracking-tight font-display flex items-center gap-2">
              Today's Horizon
              <span className={`text-xs px-2 py-0.5 rounded-full font-normal ${neuInsetClass}`}>
                {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
              </span>
            </h3>
            <button
              onClick={() => {
                playSoftClick(soundEnabled);
                onOpenNewTask();
              }}
              className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1 ${neuCardClass} hover:text-[#5DA8A8] neu-button`}
            >
              <Plus size={15} /> Add Task
            </button>
          </div>

          {/* Today's Horizon Task List */}
          <div className="space-y-3.5">
            {filteredTasks.length === 0 ? (
              <div className={`p-8 rounded-2xl text-center ${neuCardClass}`}>
                <p className={`text-sm ${darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                  No tasks found in this category. Take a moment to rest or capture a new task.
                </p>
              </div>
            ) : (
              filteredTasks.map(task => {
                const totalSt = task.subtasks.length;
                const doneSt = task.subtasks.filter(s => s.done).length;
                const pct = totalSt === 0 ? 0 : Math.round((doneSt / totalSt) * 100);
                const isCurrentActive = activeTask?.id === task.id;

                return (
                  <div
                    key={task.id}
                    className={`p-4 sm:p-5 rounded-2xl transition-all ${neuCardClass} ${
                      isCurrentActive ? 'ring-2 ring-[#5DA8A8]/70' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => {
                          playSoftClick(soundEnabled);
                          setActiveTask(task);
                        }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5DA8A8]">
                            {task.category}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            task.priority === 'High' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                          }`}>
                            {task.priority} Priority
                          </span>
                        </div>
                        <h4 className="text-base font-semibold font-display">{task.title}</h4>
                      </div>

                      <button
                        onClick={() => {
                          playSoftClick(soundEnabled);
                          onOpenTaskModal(task);
                        }}
                        className={`p-2 rounded-xl text-xs ${neuCardClass} hover:text-[#5DA8A8] neu-button`}
                        title="View details"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>

                    {/* Subtasks inline preview */}
                    <div className="mt-3 space-y-1.5">
                      {task.subtasks.slice(0, 3).map(sub => (
                        <div
                          key={sub.id}
                          onClick={() => {
                            playSoftClick(soundEnabled);
                            onToggleSubtask(task.id, sub.id);
                          }}
                          className="flex items-center gap-2 text-xs cursor-pointer select-none py-0.5"
                        >
                          {sub.done ? (
                            <CheckCircle2 size={16} className="text-[#5DA8A8] shrink-0" />
                          ) : (
                            <Circle size={16} className={`shrink-0 ${darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`} />
                          )}
                          <span className={sub.done ? 'line-through opacity-50' : ''}>{sub.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4 pt-2 border-t border-gray-200/40 dark:border-gray-800/40 flex items-center gap-3">
                      <div className={`flex-1 h-2 rounded-full overflow-hidden ${neuInsetClass}`}>
                        <div
                          className="h-full bg-[#5DA8A8] transition-all duration-300 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-[#5DA8A8]">{pct}%</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 5 Cols: Sticky Pomodoro Timer Widget */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <SteadyTimerWidget
            timerSeconds={timerSeconds}
            isTimerRunning={isTimerRunning}
            setIsTimerRunning={setIsTimerRunning}
            timerMode={timerMode}
            setTimerMode={setTimerMode}
            setTimerSeconds={setTimerSeconds}
            completedSessions={completedSessions}
            activeTask={activeTask}
            soundEnabled={soundEnabled}
            darkMode={darkMode}
            neuCardClass={neuCardClass}
            neuInsetClass={neuInsetClass}
          />
        </div>

      </div>
    </div>
  );
}
