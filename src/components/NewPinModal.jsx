import React, { useState } from 'react';
import { Bookmark, X } from 'lucide-react';
import { CATEGORIES } from '../utils/storage';
import { playSoftClick, playSuccessChime } from '../utils/audio';

export default function NewPinModal({
  onClose,
  onAddPin,
  soundEnabled,
  darkMode,
  neuCardClass,
  neuInsetClass
}) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('article'); // 'article' | 'video' | 'audio' | 'quote'
  const [url, setUrl] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [category, setCategory] = useState('Academics');
  const [quote, setQuote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    playSoftClick(soundEnabled);

    // Dynamic image placeholder based on type
    let imageUrl = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80';
    if (type === 'video') imageUrl = 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&auto=format&fit=crop&q=80';
    if (type === 'audio') imageUrl = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';

    onAddPin({
      id: `p-${Date.now()}`,
      title: title.trim(),
      type,
      url: url.trim(),
      durationMinutes: Number(durationMinutes) || 10,
      category,
      imageUrl,
      quote: quote.trim()
    });

    playSuccessChime(soundEnabled);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className={`max-w-lg w-full p-6 sm:p-7 rounded-3xl ${neuCardClass} shadow-2xl relative`}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold font-display flex items-center gap-2">
            <Bookmark size={20} className="text-[#5DA8A8]" /> Quick-Capture Downtime Item
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
            <label className="font-semibold block mb-1">Item Title / Headline</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Visual Guide to ECG Interpretation in ACS"
              className={`w-full p-3.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#5DA8A8]/60 ${neuInsetClass}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">Media Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={`w-full p-3 rounded-xl focus:outline-none ${neuInsetClass}`}
              >
                <option value="article">Article / Reading</option>
                <option value="video">Video / YouTube</option>
                <option value="audio">Podcast / Audio</option>
                <option value="quote">Quote / Excerpt</option>
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-1">Duration (Minutes)</label>
              <input
                type="number"
                min="1"
                max="180"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className={`w-full p-3 rounded-xl focus:outline-none ${neuInsetClass}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">Category Pillar</label>
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
              <label className="font-semibold block mb-1">URL Link (Optional)</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className={`w-full p-3 rounded-xl focus:outline-none ${neuInsetClass}`}
              />
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1">Key Takeaway / Highlight Quote</label>
            <input
              type="text"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="e.g. ST-segment elevation points directly to ischemia..."
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
              Save to Pinboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
