import React, { useState } from 'react';
import { Plus, Shuffle, Clock, ExternalLink, Trash2, Sparkles, Film, BookOpen, Video, Music } from 'lucide-react';
import { playSoftClick, playSuccessChime } from '../utils/audio';

export default function PinboardView({
  pinboardItems,
  onOpenNewPin,
  onDeletePin,
  soundEnabled,
  darkMode,
  neuCardClass,
  neuInsetClass
}) {
  const [pickModalOpen, setPickModalOpen] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState(15);
  const [isShuffling, setIsShuffling] = useState(false);
  const [pickedItem, setPickedItem] = useState(null);

  const handlePickForMe = () => {
    playSoftClick(soundEnabled);
    setIsShuffling(true);
    setPickedItem(null);

    const eligible = pinboardItems.filter(item => item.durationMinutes <= selectedMinutes);
    const pool = eligible.length > 0 ? eligible : pinboardItems;

    let count = 0;
    const interval = setInterval(() => {
      const randomTemp = pool[Math.floor(Math.random() * pool.length)];
      setPickedItem(randomTemp);
      count++;
      if (count >= 10) {
        clearInterval(interval);
        setIsShuffling(false);
        playSuccessChime(soundEnabled);
      }
    }, 100);
  };

  const getMediaIcon = (type) => {
    switch (type) {
      case 'video': return <Video size={14} />;
      case 'audio': return <Music size={14} />;
      case 'article': case 'read': return <BookOpen size={14} />;
      default: return <Film size={14} />;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl neuCardClass bg-[#5DA8A8]/5 border border-[#5DA8A8]/20">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs font-bold uppercase tracking-wider text-[#5DA8A8]">
            <Sparkles size={16} /> Downtime Hub
          </div>
          <h2 className="text-2xl font-bold tracking-tight font-display">
            Free-Time Pinboard
          </h2>
          <p className={`text-xs sm:text-sm mt-1 max-w-2xl ${darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
            Curated articles, videos, and relaxation breaks. Select your available time to get a recommendation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playSoftClick(soundEnabled);
              setPickModalOpen(true);
            }}
            className="px-4 py-2.5 bg-[#5DA8A8] hover:bg-[#4E9393] text-white text-xs font-semibold rounded-xl transition flex items-center gap-2 shadow-sm neu-button font-display"
          >
            <Shuffle size={16} /> Pick For Me
          </button>

          <button
            onClick={() => {
              playSoftClick(soundEnabled);
              onOpenNewPin();
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${neuCardClass} hover:text-[#5DA8A8] neu-button`}
          >
            <Plus size={16} /> Save Item
          </button>
        </div>
      </div>

      {/* Masonry Pinboard Grid */}
      {pinboardItems.length === 0 ? (
        <div className={`p-12 rounded-3xl text-center ${neuCardClass}`}>
          <p className={`text-sm mb-4 ${darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
            Your pinboard is empty. Save articles, videos, or audio tracks for your breaks.
          </p>
          <button
            onClick={() => {
              playSoftClick(soundEnabled);
              onOpenNewPin();
            }}
            className="px-4 py-2.5 bg-[#5DA8A8] text-white text-xs font-semibold rounded-xl neu-button"
          >
            Save First Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pinboardItems.map(item => (
            <div
              key={item.id}
              className={`rounded-2xl overflow-hidden transition-all duration-300 ${neuCardClass} flex flex-col justify-between hover:scale-[1.01]`}
            >
              {/* Media Thumbnail Preview */}
              {item.imageUrl && (
                <div className="h-40 w-full overflow-hidden relative bg-gray-200 dark:bg-gray-800">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider bg-black/60 text-white backdrop-blur-md flex items-center gap-1">
                    <Clock size={12} /> {item.durationMinutes} min
                  </div>
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#5DA8A8] text-white flex items-center gap-1 shadow-md">
                    {getMediaIcon(item.type)} {item.type}
                  </div>
                </div>
              )}

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#5DA8A8] mb-1">
                    <span>{item.category}</span>
                    {!item.imageUrl && (
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {item.durationMinutes} min
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold font-display line-clamp-2">
                    {item.title}
                  </h3>

                  {item.quote && (
                    <blockquote className={`mt-2 text-xs italic pl-3 border-l-2 border-[#5DA8A8] ${darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                      "{item.quote}"
                    </blockquote>
                  )}
                </div>

                {/* Footer Action Links */}
                <div className="pt-3 border-t border-gray-200/40 dark:border-gray-800/40 flex items-center justify-between">
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-[#5DA8A8] hover:underline flex items-center gap-1"
                    >
                      Open Link <ExternalLink size={13} />
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400">Saved Note</span>
                  )}

                  <button
                    onClick={() => {
                      playSoftClick(soundEnabled);
                      onDeletePin(item.id);
                    }}
                    className="p-1.5 rounded-lg opacity-60 hover:opacity-100 hover:text-rose-500 transition"
                    title="Delete item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* "Pick For Me" Action Engine Modal */}
      {pickModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className={`max-w-md w-full p-6 sm:p-7 rounded-3xl ${neuCardClass} shadow-2xl relative`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold font-display flex items-center gap-2">
                <Shuffle size={20} className="text-[#5DA8A8]" /> Pick a Break
              </h3>
              <button
                onClick={() => setPickModalOpen(false)}
                className={`p-1.5 rounded-xl ${neuCardClass} text-xs font-bold`}
              >
                ✕
              </button>
            </div>

            <p className={`text-xs mb-5 ${darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
              Select your available free time. Steady will choose an item for you.
            </p>

            {/* Minutes Selector */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {[5, 15, 30, 60].map(mins => (
                <button
                  key={mins}
                  onClick={() => {
                    playSoftClick(soundEnabled);
                    setSelectedMinutes(mins);
                  }}
                  className={`py-2.5 rounded-xl text-xs font-bold transition neu-button ${
                    selectedMinutes === mins
                      ? `${neuInsetClass} text-[#5DA8A8] ring-2 ring-[#5DA8A8]/50`
                      : neuCardClass
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>

            {/* Shuffle Result Display */}
            {pickedItem ? (
              <div className={`p-4 rounded-2xl mb-6 ${neuInsetClass} border border-[#5DA8A8]/30 animate-fadeIn`}>
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#5DA8A8] mb-1">
                  <span>Recommendation</span>
                  <span>{pickedItem.durationMinutes} min</span>
                </div>
                <h4 className="text-base font-bold font-display mb-1">{pickedItem.title}</h4>
                {pickedItem.quote && (
                  <p className="text-xs italic text-gray-500 mb-3 font-serif">"{pickedItem.quote}"</p>
                )}
                {pickedItem.url && (
                  <a
                    href={pickedItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#5DA8A8] text-white text-xs font-semibold rounded-lg"
                  >
                    Open Now <ExternalLink size={12} />
                  </a>
                )}
              </div>
            ) : isShuffling ? (
              <div className={`p-6 rounded-2xl mb-6 text-center ${neuInsetClass}`}>
                <Sparkles size={24} className="mx-auto text-[#5DA8A8] animate-spin mb-2" />
                <p className="text-xs font-semibold text-[#5DA8A8]">Finding a recommendation...</p>
              </div>
            ) : null}

            <div className="flex items-center gap-3">
              <button
                onClick={handlePickForMe}
                disabled={isShuffling}
                className="flex-1 py-3 bg-[#5DA8A8] hover:bg-[#4E9393] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 neu-button shadow-sm"
              >
                <Shuffle size={16} /> {pickedItem ? 'Pick Another' : 'Get Recommendation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
