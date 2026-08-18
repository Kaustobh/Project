import { Briefcase, GraduationCap, User, Calendar, Compass } from 'lucide-react';

export const CATEGORIES = [
  { id: 'all', label: 'All Categories', icon: Compass, color: '#5DA8A8' },
  { id: 'Professional Life', label: 'Professional', icon: Briefcase, color: '#3B82F6' },
  { id: 'Academics', label: 'Academics', icon: GraduationCap, color: '#8B5CF6' },
  { id: 'Personal Life', label: 'Personal', icon: User, color: '#10B981' },
  { id: 'Events', label: 'Events', icon: Calendar, color: '#F59E0B' },
];

export const INITIAL_TASKS = [
  {
    id: 't-1',
    title: 'Review ICU Patient Rounds & Lab Panels',
    category: 'Professional Life',
    priority: 'High',
    dueDate: '2026-08-18',
    dueTime: '11:00',
    estimatedBlocks: 2,
    completedBlocks: 1,
    subtasks: [
      { id: 's1', text: 'Analyze CBC and metabolic panel for Bed 4', done: true },
      { id: 's2', text: 'Document differential diagnoses for attending physician', done: false },
      { id: 's3', text: 'Coordinate electrolyte infusion protocol with nursing team', done: false }
    ],
    notes: '# ICU Handover Priorities\n- Bed 4 potassium adjustment required before noon.\n- Confirm lab re-check at 14:00.',
    fieldNotes: '10:15 AM - Attending consultant approved electrolyte protocol.'
  },
  {
    id: 't-2',
    title: 'Pharmacology Chapter 8: Beta Blockers & Anti-hypertensives',
    category: 'Academics',
    priority: 'High',
    dueDate: '2026-08-18',
    dueTime: '15:30',
    estimatedBlocks: 3,
    completedBlocks: 1,
    subtasks: [
      { id: 's4', text: 'Read active mechanism of action & receptor selectivity', done: true },
      { id: 's5', text: 'Generate 10 active recall flashcards on contraindications', done: false },
      { id: 's6', text: 'Solve 15 practice clinical scenario questions', done: false }
    ],
    notes: 'Focus on asthma & COPD contraindications in non-selective beta-blockers.',
    fieldNotes: '12:00 PM - Finished reading receptor selectivity charts.'
  },
  {
    id: 't-3',
    title: 'Meal Prep & Kitchen Cleanup for Evening Shift',
    category: 'Personal Life',
    priority: 'Medium',
    dueDate: '2026-08-18',
    dueTime: '18:00',
    estimatedBlocks: 1,
    completedBlocks: 0,
    subtasks: [
      { id: 's7', text: 'Prepare high-protein lunch box for night duty', done: false },
      { id: 's8', text: 'Wipe kitchen counters and organize spices', done: false }
    ],
    notes: 'Keep meal prep under 30 minutes to save time for study.',
    fieldNotes: ''
  },
  {
    id: 't-4',
    title: 'Clinical Department Seminar Presentation Draft',
    category: 'Events',
    priority: 'High',
    dueDate: '2026-08-19',
    dueTime: '09:00',
    estimatedBlocks: 4,
    completedBlocks: 2,
    subtasks: [
      { id: 's9', text: 'Draft title slide and case presentation summary', done: true },
      { id: 's10', text: 'Create diagnostic algorithm flowchart slide', done: true },
      { id: 's11', text: 'Review citations and guideline updates', done: false }
    ],
    notes: 'Keep presentation concise (12 slides max).',
    fieldNotes: '09:30 AM - Flowchart generated.'
  }
];

// Using project attached images for Pinboard items
export const INITIAL_PINBOARD = [
  {
    id: 'p-1',
    title: 'Visual Guide to ECG Interpretation in Acute Coronary Syndrome',
    type: 'article',
    url: 'https://example.com/ecg-guide',
    durationMinutes: 15,
    category: 'Academics',
    imageUrl: '/KPI_4.jpeg',
    quote: 'ST-segment elevation in contiguous leads points directly to regional ischemia.'
  },
  {
    id: 'p-2',
    title: '10-Minute Box Breathing Technique for Stress Reduction',
    type: 'video',
    url: 'https://example.com/box-breathing',
    durationMinutes: 10,
    category: 'Personal Life',
    imageUrl: '/KPI_5.jpeg',
    quote: 'Inhale for 4s, hold for 4s, exhale for 4s, hold for 4s.'
  },
  {
    id: 'p-3',
    title: 'The 80/20 Rule for Medical Study Efficiency',
    type: 'read',
    url: 'https://example.com/80-20-med',
    durationMinutes: 20,
    category: 'Professional Life',
    imageUrl: '/KPI_6.jpeg',
    quote: 'Focus 80% of your time on core diagnostic criteria that yield 80% of clinical accuracy.'
  },
  {
    id: 'p-4',
    title: 'Steady Focus Blueprint & Grounding Ambient Soundscapes',
    type: 'audio',
    url: 'https://example.com/ambient-focus',
    durationMinutes: 45,
    category: 'Personal Life',
    imageUrl: '/logo.jpeg',
    quote: 'Gentle acoustic soundscapes designed to reduce cognitive strain.'
  }
];

export const INITIAL_REFLECTION = {
  date: '2026-08-18',
  groundedScore: 4, // 1 to 5
  timeSavedMinutes: 75,
  timeInvestedMinutes: 120,
  qualitativeNotes: 'Managed ICU handover efficiently. Prioritized one task at a time without feeling rushed.',
  rolledOverTasksCount: 0
};
