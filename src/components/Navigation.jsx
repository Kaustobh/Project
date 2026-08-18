import React from 'react';
import { LayoutDashboard, CheckSquare, GitGraph, Calendar, Bookmark, BarChart2 } from 'lucide-react';
import { playSoftClick } from '../utils/audio';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'flow', label: 'Flow Map', icon: GitGraph },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'pinboard', label: 'Pinboard', icon: Bookmark },
  { id: 'analytics', label: 'Reflection', icon: BarChart2 },
];

export default function Navigation({
  activeTab,
  setActiveTab,
  darkMode,
  soundEnabled,
  neuCardClass,
  neuInsetClass
}) {
  return (
    <>
      {/* Desktop Navigation Ribbon */}
      <nav className="hidden md:flex justify-center max-w-7xl mx-auto px-6 mb-6">
        <div className={`p-1.5 rounded-2xl flex items-center gap-1.5 ${neuCardClass} overflow-x-auto no-scrollbar`}>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  playSoftClick(soundEnabled);
                  setActiveTab(item.id);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap neu-button ${
                  isActive
                    ? `${neuInsetClass} text-[#5DA8A8]`
                    : 'hover:text-[#5DA8A8]'
                }`}
              >
                <Icon size={15} className={isActive ? 'text-[#5DA8A8]' : 'opacity-60'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Floating Bottom Bar */}
      <nav className="md:hidden fixed bottom-3 left-3 right-3 z-40">
        <div className={`p-1.5 rounded-2xl flex items-center justify-around ${neuCardClass} border border-gray-200/50 dark:border-gray-800/50 shadow-2xl overflow-x-auto`}>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  playSoftClick(soundEnabled);
                  setActiveTab(item.id);
                }}
                className={`p-2.5 rounded-xl flex flex-col items-center gap-1 transition-all neu-button shrink-0 ${
                  isActive
                    ? `${neuInsetClass} text-[#5DA8A8]`
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <Icon size={16} />
                <span className="text-[9px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
