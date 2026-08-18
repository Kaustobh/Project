# 05. Technical Architecture & Unified Reactive Schema

> **Stack:** React 18 + Vite 6 + Tailwind CSS 3 + Lucide Icons + Canvas Confetti + Web Audio API.
> **Architecture:** Unified Relational Reactive Workspace with bidirectional cascading state updates, interactive 2D Flow Canvas, polymorphic Multi-Category Event Engine, and WCAG 2.1 AA accessibility compliance.

---

## 🏗️ 1. Unified Relational Schema Definitions (`src/types/schema.ts`)

```typescript
export interface BaseEntity {
  id: string; // UUIDv4
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  isArchived: boolean;
}

export type TagScope = 'global' | 'task' | 'event' | 'flow';

export interface Tag extends BaseEntity {
  name: string;
  colorHex: string;
  scope: TagScope;
}

export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Task extends BaseEntity {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  completedAt?: string;
  assignedNodeId?: string; // Foreign Key to FlowNode.id
  linkedEventIds: string[]; // Foreign Keys to Event.id
  tagIds: string[]; // Foreign Keys to Tag.id
  dependencyTaskIds: string[]; // Self-referencing FKs for prerequisite tasks
}

export type EventCategory = 
  | 'party' 
  | 'conference' 
  | 'meeting' 
  | 'video_call' 
  | 'workshop' 
  | 'hackathon' 
  | 'custom';

export interface EventEntity extends BaseEntity {
  title: string;
  category: EventCategory;
  customCategoryName?: string;
  startDate: string;
  endDate: string;
  locationType: 'physical' | 'virtual' | 'hybrid';
  locationDetails: {
    address?: string;
    meetingUrl?: string;
    dialInPin?: string;
  };
  linkedTaskIds: string[]; // Foreign Keys to Task.id
  linkedFlowNodeIds: string[]; // Foreign Keys to FlowNode.id
  tagIds: string[];
}

export type FlowNodeType = 'taskNode' | 'eventNode' | 'milestoneNode' | 'decisionNode';

export interface FlowNode extends BaseEntity {
  canvasId: string;
  type: FlowNodeType;
  position: { x: number; y: number };
  data: {
    label: string;
    refEntityId?: string;
    status?: string;
    category?: string;
  };
}

export interface FlowEdge extends BaseEntity {
  canvasId: string;
  sourceNodeId: string;
  targetNodeId: string;
  conditionLabel?: string;
  animated?: boolean;
}
```

---

## ⚡ 2. Reactive State Engine (`src/store/reactiveStore.js`)

- **Bidirectional Cascading Updates:**
  - `CREATE_TASK`: Populates relational arrays (`linkedEventIds`, `assignedNodeId`).
  - `UPDATE_TASK`: Automatically syncs title, status, and due dates across Calendar Agendas and Flow Canvas Nodes.
  - `DELETE_TASK`: Cascading removal of task references from linked events and nodes. Triggers a 5-second Undo notification toast.
  - `CREATE_EVENT`: Renders polymorphic metadata (virtual streaming links for `video_call`, venue details for `party`/`conference`).
  - `ADD_TASK_TO_EVENT`: Inserts task, auto-links IDs, and places a node on the Flow Canvas.
  - `FLOW_CANVAS_OPERATIONS`: Node dragging, connection edge routing, and node deletion (which severs graph edges while preserving primary DB entities).

---

## ♿ 3. WCAG 2.1 AA Compliance & Accessibility

- **Contrast Ratios:** Text-to-background ratio $\ge 4.5:1$ with high-contrast borders (`#E2E8F0` / `#27272A`).
- **Focus Ring Management:** Visible 2px offset focus rings (`focus-visible:ring-2 focus-visible:ring-[#5DA8A8] focus-visible:ring-offset-2`).
- **Reduced Motion Support:** All spring/particle animations wrap in `@media (prefers-reduced-motion: reduce)` fallbacks.
- **Screen Reader Announcements:** Dynamic state changes output to `<div aria-live="polite">` announcer region.
