// TypeScript Core Relational Schema Definitions

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
  category?: string;
  estimatedBlocks?: number;
  completedBlocks?: number;
  subtasks?: { id: string; text: string; done: boolean }[];
  notes?: string;
  fieldNotes?: string;
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
  customCategoryName?: string; // Set if category === 'custom'
  startDate: string; // ISO 8601 or YYYY-MM-DD
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
  attendeesCount?: number;
}

export type FlowNodeType = 'taskNode' | 'eventNode' | 'milestoneNode' | 'decisionNode';

export interface FlowNode extends BaseEntity {
  canvasId: string;
  type: FlowNodeType;
  position: { x: number; y: number };
  data: {
    label: string;
    refEntityId?: string; // Reference to Task.id or Event.id
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
