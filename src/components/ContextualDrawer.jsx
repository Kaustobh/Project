import React from 'react';
import { X, CheckCircle2, Calendar, Link, Sparkles, Trash2, Clock, Tag } from 'lucide-react';
import { playSoftClick } from '../utils/audio';

export default function ContextualDrawer({
  isOpen,
  onClose,
  entity, // Task | EventEntity | FlowNode
  entityType, // 'task' | 'event' | 'node'
  onUpdateEntity,
  onDeleteEntity,
  soundEnabled,
  darkMode,
  neuCardClass,
  neuInsetClass
}) {
  if (!isOpen || !entity) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm animate-fadeIn flex justify-end">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Contextual Side Drawer"
        className={`w-full max-w-md h-full p-6 sm:p-7 shadow-2xl overflow-y-auto transition-transform ${neuCardClass} border-l border-[#E2E8F0] dark:border-[#27272A] flex flex-col justify-between`}
      >
        <div className="space-y-6">
          {/* Drawer Header */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5DA8A8] flex items-center gap-1">
              <Sparkles size={14} /> Contextual Drawer ({entityType})
            </span>
            <button
              onClick={() => {
                playSoftClick(soundEnabled);
                onClose();
              }}
              className={`p-2 rounded-xl text-xs font-bold ${neuCardClass} hover:text-[#5DA8A8] neu-button`}
            >
              <X size={16} />
            </button>
          </div>

          {/* Render Entity Inspector */}
          {entityType === 'task' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#5DA8A8] block mb-1">Task Title</label>
                <input
                  type="text"
                  value={entity.title}
                  onChange={(e) => onUpdateEntity({ ...entity, title: e.target.value })}
                  className={`w-full p-3 rounded-xl font-bold font-display text-sm focus:outline-none ${neuInsetClass}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Status</label>
                  <select
                    value={entity.status}
                    onChange={(e) => onUpdateEntity({ ...entity, status: e.target.value })}
                    className={`w-full p-3 rounded-xl focus:outline-none ${neuInsetClass}`}
                  >
                    <option value="todo">To-Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="backlog">Backlog</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1">Priority</label>
                  <select
                    value={entity.priority}
                    onChange={(e) => onUpdateEntity({ ...entity, priority: e.target.value })}
                    className={`w-full p-3 rounded-xl focus:outline-none ${neuInsetClass}`}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Description</label>
                <textarea
                  rows={4}
                  value={entity.description || ''}
                  onChange={(e) => onUpdateEntity({ ...entity, description: e.target.value })}
                  className={`w-full p-3 rounded-xl focus:outline-none ${neuInsetClass}`}
                />
              </div>

              {entity.assignedNodeId && (
                <div className={`p-3 rounded-xl ${neuInsetClass} text-emerald-500 font-semibold flex items-center gap-2`}>
                  <Link size={14} /> Bidirectionally linked to Flow Canvas Node
                </div>
              )}
            </div>
          )}

          {entityType === 'event' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-blue-500 block mb-1">Event Title</label>
                <input
                  type="text"
                  value={entity.title}
                  onChange={(e) => onUpdateEntity({ ...entity, title: e.target.value })}
                  className={`w-full p-3 rounded-xl font-bold font-display text-sm focus:outline-none ${neuInsetClass}`}
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Category</label>
                <span className="px-3 py-1 rounded-full font-bold bg-blue-500/10 text-blue-500 capitalize">
                  {entity.category}
                </span>
              </div>

              {entity.locationDetails?.meetingUrl && (
                <div>
                  <label className="font-bold block mb-1">Virtual Meeting Room</label>
                  <p className="font-mono text-blue-500 break-all">{entity.locationDetails.meetingUrl}</p>
                </div>
              )}
            </div>
          )}

          {entityType === 'node' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-purple-500 block mb-1">Canvas Node Label</label>
                <input
                  type="text"
                  value={entity.data?.label || ''}
                  onChange={(e) => onUpdateEntity({ ...entity, data: { ...entity.data, label: e.target.value } })}
                  className={`w-full p-3 rounded-xl font-bold font-display text-sm focus:outline-none ${neuInsetClass}`}
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Node Type</label>
                <span className="px-3 py-1 rounded-full font-bold bg-purple-500/10 text-purple-500 uppercase">
                  {entity.type}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-gray-200/40 dark:border-gray-800/40 flex items-center justify-between">
          <button
            onClick={() => {
              playSoftClick(soundEnabled);
              onDeleteEntity(entity.id);
              onClose();
            }}
            className="p-2.5 rounded-xl text-rose-500 hover:bg-rose-500/10 text-xs font-semibold flex items-center gap-1"
          >
            <Trash2 size={16} /> Delete Entity
          </button>

          <button
            onClick={() => {
              playSoftClick(soundEnabled);
              onClose();
            }}
            className="px-5 py-2.5 bg-[#5DA8A8] text-white text-xs font-bold rounded-xl neu-button"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
