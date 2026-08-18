import React, { useState } from 'react';
import { Plus, LayoutGrid, List, CheckCircle2, Circle, ChevronRight, Play, Clock, Sparkles, Filter } from 'lucide-react';
import { CATEGORIES } from '../utils/storage';
import { playSoftClick } from '../utils/audio';

export default function TasksView({
  tasks,
  activeTask,
  setActiveTask,
  activeCategory,
  setActiveCategory,
  onToggleSubtask,
  onOpenTaskModal,
  onOpenNewTask,
  setIsTimerRunning,
  soundEnabled,
  darkMode,
  neuCardClass,
  neuInsetClass
}) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [priorityFilter, setPriorityFilter] = useState('all'); // 'all' | 'High' | 'Medium' | 'Low'

  const filteredTasks = tasks.filter(t => {
    const matchesCategory = activeCategory === 'all' || t.category === activeCategory;
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    return matchesCategory && matchesPriority;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight font-display">Tasks & Execution Engine</h2>
          <p className={`text-xs ${darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
            Structured focus blocks and single-task execution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Grid / List View Toggle */}
          <div className={`p-1 rounded-xl flex items-center gap-1 ${neuCardClass}`}>
            <button
              onClick={() => {
                playSoftClick(soundEnabled);
                setViewMode('grid');
              }}
              className={`p-2 rounded-lg text-xs font-medium transition neu-button ${
                viewMode === 'grid' ? `${neuInsetClass} text-[#5DA8A8]` : 'opacity-70'
              }`}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => {
                playSoftClick(soundEnabled);
                setViewMode('list');
              }}
              className={`p-2 rounded-lg text-xs font-medium transition neu-button ${
                viewMode === 'list' ? `${neuInsetClass} text-[#5DA8A8]` : 'opacity-70'
              }`}
              title="List View"
            >
              <List size={16} />
            </button>
          </div>

          {/* New Task Button */}
          <button
            onClick={() => {
              playSoftClick(soundEnabled);
              onOpenNewTask();
            }}
            className="px-4 py-2.5 bg-[#5DA8A8] hover:bg-[#4E9393] text-white text-xs font-semibold rounded-xl transition flex items-center gap-2 shadow-sm neu-button"
          >
            <Plus size={16} /> Create Task
          </button>
        </div>
      </div>

      {/* Filter Ribbons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
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
                  isActive ? `${neuInsetClass} text-[#5DA8A8]` : neuCardClass
                }`}
              >
                <Icon size={14} className={isActive ? 'text-[#5DA8A8]' : 'opacity-60'} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Priority Selector */}
        <div className="flex items-center gap-1.5 text-xs">
          <Filter size={14} className="opacity-60" />
          <span className={darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}>Priority:</span>
          {['all', 'High', 'Medium', 'Low'].map(p => (
            <button
              key={p}
              onClick={() => {
                playSoftClick(soundEnabled);
                setPriorityFilter(p);
              }}
              className={`px-2.5 py-1 rounded-lg font-medium capitalize transition neu-button ${
                priorityFilter === p ? `${neuInsetClass} text-[#5DA8A8] font-bold` : 'opacity-70'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks Display */}
      {filteredTasks.length === 0 ? (
        <div className={`p-12 rounded-3xl text-center ${neuCardClass}`}>
          <p className={`text-sm mb-4 ${darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
            No tasks match your selected criteria.
          </p>
          <button
            onClick={() => {
              playSoftClick(soundEnabled);
              onOpenNewTask();
            }}
            className="px-4 py-2.5 bg-[#5DA8A8] text-white text-xs font-semibold rounded-xl neu-button"
          >
            Create New Task
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-5' : 'space-y-4'}>
          {filteredTasks.map(task => {
            const totalSubtasks = task.subtasks.length;
            const completedSubtasks = task.subtasks.filter(s => s.done).length;
            const progressPercent = totalSubtasks === 0 ? 0 : Math.round((completedSubtasks / totalSubtasks) * 100);
            const isCurrentActive = activeTask?.id === task.id;

            return (
              <div
                key={task.id}
                className={`p-5 sm:p-6 rounded-2xl transition-all ${neuCardClass} flex flex-col justify-between ${
                  isCurrentActive ? 'ring-2 ring-[#5DA8A8]/70' : ''
                }`}
              >
                <div>
                  {/* Category & Priority Badge Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5DA8A8]">
                      {task.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium ${
                        task.priority === 'High'
                          ? 'bg-rose-500/10 text-rose-500'
                          : task.priority === 'Medium'
                          ? 'bg-amber-500/10 text-amber-500'
                          : 'bg-emerald-500/10 text-emerald-500'
                      }`}>
                        {task.priority} Priority
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${neuInsetClass}`}>
                        {task.completedBlocks}/{task.estimatedBlocks} blocks
                      </span>
                    </div>
                  </div>

                  {/* Task Title */}
                  <h3
                    onClick={() => {
                      playSoftClick(soundEnabled);
                      onOpenTaskModal(task);
                    }}
                    className="text-lg font-bold font-display cursor-pointer hover:text-[#5DA8A8] transition-colors mb-3"
                  >
                    {task.title}
                  </h3>

                  {/* Subtask Checkpoints List */}
                  <div className="space-y-2 mb-4">
                    {task.subtasks.map(sub => (
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
                </div>

                {/* Progress Bar & Actions Footer */}
                <div className="pt-3 border-t border-gray-200/40 dark:border-gray-800/40 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className={darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}>Dynamic Execution</span>
                    <span className="text-[#5DA8A8]">{progressPercent}%</span>
                  </div>

                  <div className={`w-full h-2 rounded-full overflow-hidden ${neuInsetClass}`}>
                    <div
                      className="h-full bg-[#5DA8A8] transition-all duration-300 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      onClick={() => {
                        playSoftClick(soundEnabled);
                        setActiveTask(task);
                        setIsTimerRunning(true);
                      }}
                      className="px-3 py-1.5 bg-[#5DA8A8] hover:bg-[#4E9393] text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5 neu-button"
                    >
                      <Play size={14} /> Start Session
                    </button>

                    <button
                      onClick={() => {
                        playSoftClick(soundEnabled);
                        onOpenTaskModal(task);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${neuCardClass} hover:text-[#5DA8A8] neu-button`}
                    >
                      Details & Notes
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
