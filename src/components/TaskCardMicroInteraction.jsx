import React, { useRef, useState } from 'react';
import { Check, Clock, ChevronRight, Tag as TagIcon, Sparkles } from 'lucide-react';
import { playSoftClick, playSuccessChime } from '../utils/audio';

export default function TaskCardMicroInteraction({
  task,
  onToggleComplete,
  onOpenDrawer,
  soundEnabled,
  darkMode,
  neuCardClass,
  neuInsetClass
}) {
  const canvasRef = useRef(null);
  const [animatingCheck, setAnimatingCheck] = useState(false);
  const isCompleted = task.status === 'completed';

  // Scoped Canvas Particle Burst (Zero layout shift)
  const triggerParticleBurst = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = rect.width;
    canvas.height = rect.height;

    const particles = [];
    const colors = ['#5DA8A8', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6'];

    for (let i = 0; i < 24; i++) {
      particles.push({
        x: rect.width / 2,
        y: rect.height / 2,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        radius: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: Math.random() * 20 + 25
      });
    }

    let frameId;
    const render = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);
      let alive = false;

      particles.forEach(p => {
        if (p.life > 0) {
          alive = true;
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= 1 / p.life;
          p.life--;

          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0, p.radius), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fill();
        }
      });

      if (alive) {
        frameId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, rect.width, rect.height);
      }
    };

    render();
  };

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    playSoftClick(soundEnabled);
    setAnimatingCheck(true);

    const nextStatus = isCompleted ? 'todo' : 'completed';
    if (nextStatus === 'completed') {
      playSuccessChime(soundEnabled);
      triggerParticleBurst(e);
    }

    onToggleComplete(task.id, nextStatus);

    setTimeout(() => {
      setAnimatingCheck(false);
    }, 400);
  };

  return (
    <div
      onClick={() => onOpenDrawer(task)}
      tabIndex={0}
      role="article"
      aria-label={`Task: ${task.title}. Status: ${task.status}. Priority: ${task.priority}`}
      className={`relative p-5 rounded-2xl transition-all duration-300 ${neuCardClass} border border-[#E2E8F0] dark:border-[#27272A] hover:border-[#5DA8A8]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5DA8A8] focus-visible:ring-offset-2 select-none group cursor-pointer ${
        isCompleted ? 'bg-opacity-70 dark:bg-opacity-70' : ''
      }`}
    >
      {/* HTML5 Canvas overlay scoped to particle burst */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-20 w-full h-full rounded-2xl"
      />

      <div className="flex items-start justify-between gap-4">
        
        {/* Elastic SVG Stroke-Draw Checkbox */}
        <button
          type="button"
          onClick={handleCheckboxClick}
          aria-label={isCompleted ? "Mark task as incomplete" : "Mark task as completed"}
          className={`relative w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-transform active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5DA8A8] focus-visible:ring-offset-1 neu-button ${
            isCompleted
              ? `${neuInsetClass} bg-[#5DA8A8] text-white border-none ring-2 ring-[#5DA8A8]/40`
              : `${neuCardClass} border border-gray-300 dark:border-gray-700 hover:border-[#5DA8A8]`
          } ${animatingCheck ? 'scale-110' : ''}`}
        >
          {isCompleted && (
            <svg
              className="w-4 h-4 text-white stroke-current stroke-2 animate-strokeDraw"
              viewBox="0 0 24 24"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>

        {/* Task Details & Opacity Transition ($1.0 -> 0.6) */}
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5DA8A8]">
              {task.category || 'Task'}
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
              task.priority === 'critical' || task.priority === 'high'
                ? 'bg-rose-500/10 text-rose-500'
                : 'bg-amber-500/10 text-amber-500'
            }`}>
              {task.priority} Priority
            </span>
          </div>

          <h4
            className={`text-base font-bold font-display transition-all duration-300 ${
              isCompleted
                ? 'line-through opacity-60 text-gray-500 dark:text-gray-400'
                : 'opacity-100 text-[#1F2937] dark:text-[#F9F9F7]'
            }`}
          >
            {task.title}
          </h4>

          {task.description && (
            <p className={`text-xs line-clamp-1 ${darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
              {task.description}
            </p>
          )}
        </div>

        <ChevronRight size={18} className="opacity-40 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-gray-200/40 dark:border-gray-800/40 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          {task.dueDate && (
            <span className="flex items-center gap-1 opacity-70">
              <Clock size={13} /> {task.dueDate}
            </span>
          )}
          {task.assignedNodeId && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#5DA8A8]/10 text-[#5DA8A8] font-semibold flex items-center gap-1">
              <Sparkles size={10} /> Linked Flow Node
            </span>
          )}
        </div>

        <span className="text-[11px] font-semibold text-[#5DA8A8]">
          {task.completedBlocks || 0}/{task.estimatedBlocks || 1} blocks
        </span>
      </div>
    </div>
  );
}
