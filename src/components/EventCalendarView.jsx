import React, { useState } from 'react';
import { Calendar as CalendarIcon, Video, Users, MapPin, Plus, ExternalLink, Phone, Sparkles, Clock, CheckSquare, ChevronRight, Tag } from 'lucide-react';
import { playSoftClick, playSuccessChime } from '../utils/audio';

export default function EventCalendarView({
  events,
  tasks,
  onCreateEvent,
  onAddTaskToEvent,
  onOpenEventDrawer,
  soundEnabled,
  darkMode,
  neuCardClass,
  neuInsetClass
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showNewEventModal, setShowNewEventModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('video_call');
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [startDate, setStartDate] = useState('2026-08-18T14:00');
  const [endDate, setEndDate] = useState('2026-08-18T15:30');
  const [locationType, setLocationType] = useState('virtual');
  const [address, setAddress] = useState('');
  const [meetingUrl, setMeetingUrl] = useState('https://meet.jit.si/steady-rounds');
  const [dialInPin, setDialInPin] = useState('4829-10');

  const filteredEvents = selectedCategory === 'all'
    ? events
    : events.filter(e => e.category === selectedCategory);

  const getCategoryBadge = (cat, customName) => {
    switch (cat) {
      case 'video_call':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-500 flex items-center gap-1"><Video size={12} /> Video Call</span>;
      case 'party':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-500 flex items-center gap-1"><Users size={12} /> Party</span>;
      case 'conference':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 flex items-center gap-1"><CalendarIcon size={12} /> Conference</span>;
      case 'workshop':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 flex items-center gap-1"><Sparkles size={12} /> Workshop</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-[#5DA8A8]">{customName || cat}</span>;
    }
  };

  const handleCreateEventSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    playSoftClick(soundEnabled);

    onCreateEvent({
      title: title.trim(),
      category,
      customCategoryName: category === 'custom' ? customCategoryName.trim() : undefined,
      startDate,
      endDate,
      locationType,
      locationDetails: {
        address: locationType !== 'virtual' ? address.trim() : undefined,
        meetingUrl: locationType !== 'physical' ? meetingUrl.trim() : undefined,
        dialInPin: locationType !== 'physical' ? dialInPin.trim() : undefined,
      }
    });

    playSuccessChime(soundEnabled);
    setShowNewEventModal(false);
    setTitle('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl neuCardClass bg-[#5DA8A8]/5 border border-[#5DA8A8]/20">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs font-bold uppercase tracking-wider text-[#5DA8A8]">
            <CalendarIcon size={16} /> Extensible Multi-Category Event Engine
          </div>
          <h2 className="text-2xl font-bold tracking-tight font-display">
            Interactive Agenda & Event Matrix
          </h2>
          <p className={`text-xs mt-0.5 ${darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
            Polymorphic metadata rendering for Video Calls, Conferences, Parties, and Workshops.
          </p>
        </div>

        <button
          onClick={() => {
            playSoftClick(soundEnabled);
            setShowNewEventModal(true);
          }}
          className="px-4 py-2.5 bg-[#5DA8A8] hover:bg-[#4E9393] text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5 shadow-sm neu-button"
        >
          <Plus size={16} /> Schedule Event
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {['all', 'video_call', 'party', 'conference', 'meeting', 'workshop', 'hackathon', 'custom'].map(cat => (
          <button
            key={cat}
            onClick={() => {
              playSoftClick(soundEnabled);
              setSelectedCategory(cat);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold capitalize transition neu-button ${
              selectedCategory === cat ? `${neuInsetClass} text-[#5DA8A8]` : neuCardClass
            }`}
          >
            {cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.map(evt => {
          const linkedTasks = tasks.filter(t => evt.linkedTaskIds.includes(t.id));

          return (
            <div
              key={evt.id}
              className={`p-6 rounded-3xl transition-all ${neuCardClass} space-y-4 flex flex-col justify-between border border-[#E2E8F0] dark:border-[#27272A]`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  {getCategoryBadge(evt.category, evt.customCategoryName)}
                  <span className="text-[11px] font-mono opacity-70">
                    {new Date(evt.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <h3 className="text-lg font-bold font-display">{evt.title}</h3>

                {/* Polymorphic Metadata Rendering */}
                {evt.category === 'video_call' && evt.locationDetails?.meetingUrl && (
                  <div className={`p-3.5 rounded-2xl text-xs space-y-2 ${neuInsetClass} border border-blue-500/20`}>
                    <div className="flex items-center justify-between font-semibold text-blue-500">
                      <span className="flex items-center gap-1.5"><Video size={14} /> Virtual Conference Room</span>
                      <a
                        href={evt.locationDetails.meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 bg-blue-500 text-white rounded-lg text-[10px] font-bold flex items-center gap-1"
                      >
                        Join Stream <ExternalLink size={10} />
                      </a>
                    </div>
                    {evt.locationDetails.dialInPin && (
                      <p className="text-[11px] text-gray-500 flex items-center gap-1 font-mono">
                        <Phone size={12} /> Dial PIN: {evt.locationDetails.dialInPin}
                      </p>
                    )}
                  </div>
                )}

                {(evt.category === 'party' || evt.category === 'conference') && evt.locationDetails?.address && (
                  <div className={`p-3.5 rounded-2xl text-xs space-y-1 ${neuInsetClass} border border-purple-500/20`}>
                    <div className="flex items-center gap-1.5 font-semibold text-purple-500">
                      <MapPin size={14} /> Venue: {evt.locationDetails.address}
                    </div>
                    {evt.attendeesCount && (
                      <p className="text-[11px] text-gray-500 flex items-center gap-1">
                        <Users size={12} /> {evt.attendeesCount} Registered Attendees
                      </p>
                    )}
                  </div>
                )}

                {/* Linked Tasks List */}
                {linkedTasks.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5DA8A8]">
                      Linked Agenda Tasks ({linkedTasks.length})
                    </span>
                    {linkedTasks.map(t => (
                      <div key={t.id} className="text-xs flex items-center gap-2 font-medium">
                        <CheckSquare size={13} className="text-[#5DA8A8]" />
                        <span className={t.status === 'completed' ? 'line-through opacity-60' : ''}>{t.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action: Add Task directly within Event Context */}
              <div className="pt-3 border-t border-gray-200/40 dark:border-gray-800/40 flex items-center justify-between">
                <button
                  onClick={() => {
                    playSoftClick(soundEnabled);
                    onAddTaskToEvent(evt.id, {
                      title: `Prepare material for ${evt.title}`,
                      category: 'Professional Life',
                      priority: 'high'
                    });
                  }}
                  className="text-xs font-semibold text-[#5DA8A8] hover:underline flex items-center gap-1"
                >
                  + Add Task inside Event
                </button>

                <button
                  onClick={() => onOpenEventDrawer(evt)}
                  className={`p-2 rounded-xl text-xs ${neuCardClass} hover:text-[#5DA8A8] neu-button`}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Schedule Event Modal */}
      {showNewEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className={`max-w-lg w-full p-6 sm:p-7 rounded-3xl ${neuCardClass} shadow-2xl relative`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold font-display flex items-center gap-2">
                <CalendarIcon size={20} className="text-[#5DA8A8]" /> Schedule Multi-Category Event
              </h3>
              <button onClick={() => setShowNewEventModal(false)} className={`p-1.5 rounded-xl ${neuCardClass} text-xs font-bold`}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEventSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold block mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Tele-Health Grand Rounds"
                  className={`w-full p-3 rounded-xl font-medium focus:outline-none ${neuInsetClass}`}
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
                    <option value="video_call">Video Call</option>
                    <option value="meeting">Meeting</option>
                    <option value="party">Party</option>
                    <option value="conference">Conference</option>
                    <option value="workshop">Workshop</option>
                    <option value="hackathon">Hackathon</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Location Type</label>
                  <select
                    value={locationType}
                    onChange={(e) => setLocationType(e.target.value)}
                    className={`w-full p-3 rounded-xl focus:outline-none ${neuInsetClass}`}
                  >
                    <option value="virtual">Virtual</option>
                    <option value="physical">Physical</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              {locationType !== 'physical' && (
                <div>
                  <label className="font-semibold block mb-1">Meeting URL</label>
                  <input
                    type="url"
                    value={meetingUrl}
                    onChange={(e) => setMeetingUrl(e.target.value)}
                    className={`w-full p-3 rounded-xl focus:outline-none ${neuInsetClass}`}
                  />
                </div>
              )}

              {locationType !== 'virtual' && (
                <div>
                  <label className="font-semibold block mb-1">Venue Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. ICU Conference Room 4B"
                    className={`w-full p-3 rounded-xl focus:outline-none ${neuInsetClass}`}
                  />
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setShowNewEventModal(false)} className={`px-4 py-2.5 rounded-xl font-semibold ${neuCardClass}`}>
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-[#5DA8A8] text-white font-bold rounded-xl neu-button">
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
