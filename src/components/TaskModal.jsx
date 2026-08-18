import React, { useState } from 'react';
import { CheckCircle2, Circle, Plus, Trash2, Clock, Calendar, FileText, MessageSquare, Play, Sparkles, X } from 'lucide-react';
import { CATEGORIES } from '../utils/storage';
import { playSoftClick, playSuccessChime } from '../utils/audio';

export default function TaskModal({
  task,
  onClose,
  onUpdateTask,
  onDeleteTask,
  onStartSession,
  soundEnabled,
  darkMode,
  neuCardClass,
  neuInsetClass
}) {
  if (!task) return null;

  const [activeTab, setActiveTab] = useState('subtasks'); // 'subtasks' | 'notes' | 'fieldNotes' | 'schedule'
  const [newSubtaskText, setNewSubtaskText] = useState('');
  const [newFieldNoteText, setNewFieldNoteText] = useState('');

  const [title, setTitle] = useState(task.title);
  const [category, setCategory] = useState(task.category);
  const [priority, setPriority] = useState(task.priority);
  const [notes, setNotes] = useState(task.notes || '');
  const [fieldNotes, setFieldNotes] = useState(task.fieldNotes || '');
  const [dueDate, setDueDate] = useState(task.dueDate || '');
  const [dueTime, setDueTime] = useState(task.dueTime || '');
  const [estimatedBlocks, setEstimatedBlocks] = useState(task.estimatedBlocks || 2);

  const totalSubtasks = task.subtasks.length;
  const completedSubtasks = task.subtasks.filter(s => s.done).length;
  const progressPercent = totalSubtasks === 0 ? 0 : Math.round((completedSubtasks / totalSubtasks) * 100);

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskText.trim()) return;
    playSoftClick(soundEnabled);

    const updatedSubtasks = [
      ...task.subtasks,
      { id: `s-${Date.now()}`, text: newSubtaskText.trim(), done: false }
    ];
    onUpdateTask({ ...task, subtasks: updatedSubtasks });
    setNewSubtaskText('');
  };

  const handleToggleSubtask = (subId) => {
    playSoftClick(soundEnabled);
    const updatedSubtasks = task.subtasks.map(s =>
      s.id === subId ? { ...s, done: !s.done } : s
    );
    onUpdateTask({ ...task, subtasks: updatedSubtasks });
  };

  const handleDeleteSubtask = (subId) => {
    playSoftClick(soundEnabled);
    const updatedSubtasks = task.subtasks.filter(s => s.id !== subId);
    onUpdateTask({ ...task, subtasks: updatedSubtasks });
  };

  const handleAddFieldNote = (e) => {
    e.preventDefault();
    if (!newFieldNoteText.trim()) return;
    playSoftClick(soundEnabled);

    const timeStamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedNote = `${fieldNotes ? fieldNotes + '\n' : ''}${timeStamp} - ${newFieldNoteText.trim()}`;
    
    setFieldNotes(formattedNote);
    onUpdateTask({ ...task, fieldNotes: formattedNote });
    setNewFieldNoteText('');
  };

  const handleSaveGeneralDetails = () => {
    playSoftClick(soundEnabled);
    onUpdateTask({
      ...task,
      title,
      category,
      priority,
      notes,
      fieldNotes,
      dueDate,
      dueTime,
      estimatedBlocks: Number(estimatedBlocks)
    });
    playSuccessChime(soundEnabled);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className={`max-w-2xl w-full p-6 sm:p-7 rounded-3xl ${neuCardClass} shadow-2xl relative max-h-[90vh] flex flex-col justify-between`}>
        
        {/* Modal Header */}
        <div>
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5DA8A8]">
                {task.category}
              </span>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium ${
                priority === 'High' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
              }`}>
                {priority} Priority
              </span>
            </div>

            <button
              onClick={() => {
                playSoftClick(soundEnabled);
                onClose();
              }}
              className={`p-1.5 rounded-xl ${neuCardClass} hover:text-[#5DA8A8] text-xs font-bold neu-button`}
            >
              <X size={16} />
            </button>
          </div>

          {/* Editable Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full text-xl font-bold font-display bg-transparent border-b border-transparent hover:border-[#5DA8A8] focus:border-[#5DA8A8] focus:outline-none mb-3 py-1`}
          />

          {/* Execution Progress Bar */}
          <div className="space-y-1.5 mb-5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className={darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}>
                Execution Progress ({completedSubtasks}/{totalSubtasks} subtasks)
              </span>
              <span className="text-[#5DA8A8]">{progressPercent}%</span>
            </div>
            <div className={`w-full h-2.5 rounded-full overflow-hidden ${neuInsetClass}`}>
              <div
                className="h-full bg-[#5DA8A8] transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Detail Tabs */}
          <div className={`p-1 rounded-xl flex items-center gap-1 mb-5 ${neuCardClass}`}>
            {[
              { id: 'subtasks', label: 'Checklist', icon: CheckCircle2 },
              { id: 'notes', label: 'Rich Notes', icon: FileText },
              { id: 'fieldNotes', label: 'Field Logs', icon: MessageSquare },
              { id: 'schedule', label: 'Schedule & Blocks', icon: Calendar },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    playSoftClick(soundEnabled);
                    setActiveTab(tab.id);
                  }}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition neu-button ${
                    isActive ? `${neuInsetClass} text-[#5DA8A8]` : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto pr-1 my-2 min-h-[220px]">
          {activeTab === 'subtasks' && (
            <div className="space-y-4">
              <form onSubmit={handleAddSubtask} className="flex gap-2">
                <input
                  type="text"
                  value={newSubtaskText}
                  onChange={(e) => setNewSubtaskText(e.target.value)}
                  placeholder="Add a new subtask checkpoint..."
                  className={`flex-1 p-3 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5DA8A8]/60 ${neuInsetClass}`}
                />
                <button
                  type="submit"
                  className="px-4 py-3 bg-[#5DA8A8] text-white text-xs font-bold rounded-xl neu-button flex items-center gap-1"
                >
                  <Plus size={15} /> Add
                </button>
              </form>

              <div className="space-y-2">
                {task.subtasks.map(sub => (
                  <div
                    key={sub.id}
                    className={`p-3 rounded-xl flex items-center justify-between gap-3 text-xs ${neuCardClass}`}
                  >
                    <div
                      onClick={() => handleToggleSubtask(sub.id)}
                      className="flex items-center gap-2.5 cursor-pointer flex-1 select-none"
                    >
                      {sub.done ? (
                        <CheckCircle2 size={16} className="text-[#5DA8A8] shrink-0" />
                      ) : (
                        <Circle size={16} className={`shrink-0 ${darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`} />
                      )}
                      <span className={sub.done ? 'line-through opacity-50' : ''}>{sub.text}</span>
                    </div>

                    <button
                      onClick={() => handleDeleteSubtask(sub.id)}
                      className="p-1 text-gray-400 hover:text-rose-500 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-3">
              <label className={`text-xs font-semibold block ${darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                Markdown Rich Notes & Context
              </label>
              <textarea
                rows={7}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter markdown notes, clinical guidelines, key formulas..."
                className={`w-full p-4 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#5DA8A8]/60 ${neuInsetClass}`}
              />
            </div>
          )}

          {activeTab === 'fieldNotes' && (
            <div className="space-y-4">
              <form onSubmit={handleAddFieldNote} className="flex gap-2">
                <input
                  type="text"
                  value={newFieldNoteText}
                  onChange={(e) => setNewFieldNoteText(e.target.value)}
                  placeholder="Timestamped quick observation (e.g. 10:15 AM - Lab confirmed)..."
                  className={`flex-1 p-3 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5DA8A8]/60 ${neuInsetClass}`}
                />
                <button
                  type="submit"
                  className="px-4 py-3 bg-[#5DA8A8] text-white text-xs font-bold rounded-xl neu-button"
                >
                  Log
                </button>
              </form>

              <div className={`p-4 rounded-xl text-xs whitespace-pre-wrap font-mono ${neuInsetClass} min-h-[140px]`}>
                {fieldNotes || 'No timestamped field notes recorded yet.'}
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
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

              <div>
                <label className="font-semibold block mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={`w-full p-3 rounded-xl focus:outline-none ${neuInsetClass}`}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Due Time</label>
                <input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className={`w-full p-3 rounded-xl focus:outline-none ${neuInsetClass}`}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold block mb-1">Estimated Focus Blocks (25m per block)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={estimatedBlocks}
                  onChange={(e) => setEstimatedBlocks(e.target.value)}
                  className={`w-full p-3 rounded-xl focus:outline-none ${neuInsetClass}`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="pt-4 border-t border-gray-200/40 dark:border-gray-800/40 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              playSoftClick(soundEnabled);
              onDeleteTask(task.id);
              onClose();
            }}
            className="p-2.5 rounded-xl text-rose-500 hover:bg-rose-500/10 text-xs font-semibold transition"
            title="Delete Task"
          >
            <Trash2 size={16} />
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onStartSession(task);
                onClose();
              }}
              className="px-4 py-2.5 bg-[#5DA8A8] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 neu-button"
            >
              <Play size={15} /> Launch Steady Timer
            </button>

            <button
              onClick={handleSaveGeneralDetails}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold ${neuCardClass} hover:text-[#5DA8A8] neu-button`}
            >
              Save Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
