import React, { useState } from 'react';
import { Plus, X, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../utils/storage';
import { playSoftClick, playSuccessChime } from '../utils/audio';

export default function NewTaskModal({
  onClose,
  onAddTask,
  soundEnabled,
  darkMode,
  neuCardClass,
  neuInsetClass
}) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Professional Life');
  const [priority, setPriority] = useState('High');
  const [estimatedBlocks, setEstimatedBlocks] = useState(2);
  const [initialSubtask, setInitialSubtask] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    playSoftClick(soundEnabled);

    const subtasks = initialSubtask.trim()
      ? [{ id: `s-${Date.now()}`, text: initialSubtask.trim(), done: false }]
      : [];

    onAddTask({
      id: `t-${Date.now()}`,
      title: title.trim(),
      category,
      priority,
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '17:00',
      estimatedBlocks: Number(estimatedBlocks) || 1,
      completedBlocks: 0,
      subtasks,
      notes: notes.trim(),
      fieldNotes: ''
    });

    playSuccessChime(soundEnabled);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className={`max-w-lg w-full p-6 sm:p-7 rounded-3xl ${neuCardClass} shadow-2xl relative`}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold font-display flex items-center gap-2">
            <Sparkles size={20} className="text-[#5DA8A8]" /> Create Anchor Task
          </h3>
          <button
            onClick={() => {
              playSoftClick(soundEnabled);
              onClose();
            }}
            className={`p-1.5 rounded-xl ${neuCardClass} text-xs font-bold`}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold block mb-1">Task Title / Action Statement</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Review ICU Patient Rounds & Lab Panels"
              className={`w-full p-3.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#5DA8A8]/60 ${neuInsetClass}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full p-3 rounded-xl focus:outline-none ${neuInsetClass}`}
              >
                {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={`w-full p-3 rounded-xl focus:outline-none ${neuInsetClass}`}
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">Estimated Blocks (25m each)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={estimatedBlocks}
                onChange={(e) => setEstimatedBlocks(e.target.value)}
                className={`w-full p-3 rounded-xl focus:outline-none ${neuInsetClass}`}
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">First Key Subtask</label>
              <input
                type="text"
                value={initialSubtask}
                onChange={(e) => setInitialSubtask(e.target.value)}
                placeholder="Initial checkpoint..."
                className={`w-full p-3 rounded-xl focus:outline-none ${neuInsetClass}`}
              />
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1">Notes / Context</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add key guidelines or reminders..."
              className={`w-full p-3 rounded-xl focus:outline-none ${neuInsetClass}`}
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2.5 rounded-xl font-semibold ${neuCardClass} hover:text-[#5DA8A8] neu-button`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#5DA8A8] hover:bg-[#4E9393] text-white font-bold rounded-xl neu-button shadow-sm font-display"
            >
              Create Anchor Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
