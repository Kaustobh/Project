import { playSoftClick, playSuccessChime } from '../utils/audio';

// Helper to generate UUIDv4-like string
export function generateUUID() {
  return 'uuid-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString(36);
}

// Initial Mock Tags
export const INITIAL_TAGS = [
  { id: 'tag-1', name: 'ICU Shift', colorHex: '#EF4444', scope: 'global', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isArchived: false },
  { id: 'tag-2', name: 'Medical Study', colorHex: '#8B5CF6', scope: 'task', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isArchived: false },
  { id: 'tag-3', name: 'Presentation', colorHex: '#3B82F6', scope: 'event', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isArchived: false },
  { id: 'tag-4', name: 'Wellness', colorHex: '#10B981', scope: 'global', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isArchived: false },
];

// Initial Mock Events (Polymorphic Multi-Category Events)
export const INITIAL_EVENTS = [
  {
    id: 'evt-1',
    title: 'ICU Patient Handover & Consultant Briefing',
    category: 'meeting',
    startDate: '2026-08-18T09:00',
    endDate: '2026-08-18T10:00',
    locationType: 'physical',
    locationDetails: { address: 'ICU Ward 4B, St. Jude Hospital' },
    linkedTaskIds: ['t-1'],
    linkedFlowNodeIds: ['node-1'],
    tagIds: ['tag-1'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isArchived: false,
    attendeesCount: 8
  },
  {
    id: 'evt-2',
    title: 'Tele-Health Grand Rounds Video Conference',
    category: 'video_call',
    startDate: '2026-08-18T14:00',
    endDate: '2026-08-18T15:30',
    locationType: 'virtual',
    locationDetails: {
      meetingUrl: 'https://telemed.hospital.org/meet/rounds-882',
      dialInPin: '4829-10'
    },
    linkedTaskIds: ['t-2', 't-4'],
    linkedFlowNodeIds: ['node-2'],
    tagIds: ['tag-3'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isArchived: false
  },
  {
    id: 'evt-3',
    title: 'Medical Interns Social Gathering',
    category: 'party',
    startDate: '2026-08-19T19:00',
    endDate: '2026-08-19T22:00',
    locationType: 'physical',
    locationDetails: { address: 'Doctor Lounge & Garden Terrace' },
    linkedTaskIds: [],
    linkedFlowNodeIds: [],
    tagIds: ['tag-4'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isArchived: false,
    attendeesCount: 15
  }
];

// Initial Mock Flow Nodes
export const INITIAL_FLOW_NODES = [
  {
    id: 'node-1',
    canvasId: 'main-canvas',
    type: 'taskNode',
    position: { x: 80, y: 120 },
    data: { label: 'Review ICU Patient Rounds & Lab Panels', refEntityId: 't-1', status: 'in_progress', category: 'Professional Life' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isArchived: false
  },
  {
    id: 'node-2',
    canvasId: 'main-canvas',
    type: 'eventNode',
    position: { x: 380, y: 120 },
    data: { label: 'Grand Rounds Video Conference', refEntityId: 'evt-2', status: 'upcoming', category: 'video_call' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isArchived: false
  },
  {
    id: 'node-3',
    canvasId: 'main-canvas',
    type: 'decisionNode',
    position: { x: 680, y: 120 },
    data: { label: 'Electrolyte Protocol Approved?', status: 'decision' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isArchived: false
  },
  {
    id: 'node-4',
    canvasId: 'main-canvas',
    type: 'milestoneNode',
    position: { x: 940, y: 120 },
    data: { label: 'Department Presentation Ready', refEntityId: 't-4', status: 'todo' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isArchived: false
  }
];

// Initial Mock Flow Edges
export const INITIAL_FLOW_EDGES = [
  { id: 'edge-1', canvasId: 'main-canvas', sourceNodeId: 'node-1', targetNodeId: 'node-2', conditionLabel: 'Handover Complete', animated: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isArchived: false },
  { id: 'edge-2', canvasId: 'main-canvas', sourceNodeId: 'node-2', targetNodeId: 'node-3', conditionLabel: 'Lab Review', animated: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isArchived: false },
  { id: 'edge-3', canvasId: 'main-canvas', sourceNodeId: 'node-3', targetNodeId: 'node-4', conditionLabel: 'Yes -> Advance', animated: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isArchived: false }
];

// Custom Reactive Store Class
export class ReactiveWorkspaceEngine {
  constructor(initialData = {}) {
    this.listeners = new Set();
    this.undoToast = null;
    this.undoTimeout = null;

    this.tags = initialData.tags || INITIAL_TAGS;
    this.tasks = initialData.tasks || [];
    this.events = initialData.events || INITIAL_EVENTS;
    this.flowNodes = initialData.flowNodes || INITIAL_FLOW_NODES;
    this.flowEdges = initialData.flowEdges || INITIAL_FLOW_EDGES;
    this.liveAnnouncement = '';
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(l => l());
  }

  setLiveAnnouncement(msg) {
    this.liveAnnouncement = msg;
    this.notify();
  }

  // --- TASK OPERATIONS (BIDIRECTIONAL CASCADING UPDATES) ---
  createTask(taskData, context = {}) {
    const taskId = generateUUID();
    const now = new Date().toISOString();

    const newTask = {
      id: taskId,
      title: taskData.title || 'Untitled Task',
      description: taskData.description || '',
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
      completedAt: taskData.status === 'completed' ? now : undefined,
      assignedNodeId: context.assignedNodeId || undefined,
      linkedEventIds: context.eventId ? [context.eventId] : (taskData.linkedEventIds || []),
      tagIds: taskData.tagIds || [],
      dependencyTaskIds: taskData.dependencyTaskIds || [],
      category: taskData.category || 'Professional Life',
      estimatedBlocks: taskData.estimatedBlocks || 2,
      completedBlocks: taskData.completedBlocks || 0,
      subtasks: taskData.subtasks || [],
      notes: taskData.notes || '',
      fieldNotes: taskData.fieldNotes || '',
      createdAt: now,
      updatedAt: now,
      isArchived: false
    };

    // If created within an Event context, auto-populate relational arrays
    if (context.eventId) {
      this.events = this.events.map(evt => {
        if (evt.id === context.eventId) {
          return {
            ...evt,
            linkedTaskIds: [...evt.linkedTaskIds, taskId],
            updatedAt: now
          };
        }
        return evt;
      });
    }

    // Auto-create Flow Node if in Flow context or explicitly requested
    if (context.createFlowNode || context.assignedNodeId) {
      const nodeId = context.assignedNodeId || generateUUID();
      newTask.assignedNodeId = nodeId;

      const newNode = {
        id: nodeId,
        canvasId: 'main-canvas',
        type: 'taskNode',
        position: context.position || { x: 150 + Math.random() * 200, y: 200 + Math.random() * 100 },
        data: {
          label: newTask.title,
          refEntityId: taskId,
          status: newTask.status,
          category: newTask.category
        },
        createdAt: now,
        updatedAt: now,
        isArchived: false
      };
      this.flowNodes.push(newNode);
    }

    this.tasks.unshift(newTask);
    this.setLiveAnnouncement(`Task created: "${newTask.title}"`);
    return newTask;
  }

  updateTask(taskId, updates) {
    const now = new Date().toISOString();
    let updatedTask = null;

    this.tasks = this.tasks.map(task => {
      if (task.id !== taskId) return task;

      const nextStatus = updates.status !== undefined ? updates.status : task.status;
      const isNewlyCompleted = nextStatus === 'completed' && task.status !== 'completed';

      updatedTask = {
        ...task,
        ...updates,
        status: nextStatus,
        completedAt: isNewlyCompleted ? now : (nextStatus !== 'completed' ? undefined : task.completedAt),
        updatedAt: now
      };

      return updatedTask;
    });

    if (!updatedTask) return;

    // Bidirectional Propagation 1: Update linked Flow Nodes
    if (updatedTask.assignedNodeId || updates.title || updates.status) {
      this.flowNodes = this.flowNodes.map(node => {
        if (node.id === updatedTask.assignedNodeId || node.data.refEntityId === taskId) {
          return {
            ...node,
            data: {
              ...node.data,
              label: updatedTask.title,
              status: updatedTask.status
            },
            updatedAt: now
          };
        }
        return node;
      });
    }

    // Bidirectional Propagation 2: Update linked Events
    if (updates.linkedEventIds) {
      this.events = this.events.map(evt => {
        const isLinkedNow = updates.linkedEventIds.includes(evt.id);
        const wasLinkedBefore = evt.linkedTaskIds.includes(taskId);

        if (isLinkedNow && !wasLinkedBefore) {
          return { ...evt, linkedTaskIds: [...evt.linkedTaskIds, taskId], updatedAt: now };
        } else if (!isLinkedNow && wasLinkedBefore) {
          return { ...evt, linkedTaskIds: evt.linkedTaskIds.filter(id => id !== taskId), updatedAt: now };
        }
        return evt;
      });
    }

    this.setLiveAnnouncement(`Task updated: "${updatedTask.title}" (${updatedTask.status})`);
    return updatedTask;
  }

  deleteTask(taskId, isSoft = true) {
    const targetTask = this.tasks.find(t => t.id === taskId);
    if (!targetTask) return;

    // Soft delete / Toast undo buffer
    if (isSoft) {
      this.undoToast = {
        type: 'TASK',
        entity: { ...targetTask },
        timestamp: Date.now()
      };

      if (this.undoTimeout) clearTimeout(this.undoTimeout);
      this.undoTimeout = setTimeout(() => {
        this.undoToast = null;
        this.notify();
      }, 5000);
    }

    // Cascading soft/hard delete: Remove taskId references from linked events and nodes
    this.tasks = this.tasks.filter(t => t.id !== taskId);

    this.events = this.events.map(evt => ({
      ...evt,
      linkedTaskIds: evt.linkedTaskIds.filter(id => id !== taskId)
    }));

    if (targetTask.assignedNodeId) {
      this.flowNodes = this.flowNodes.filter(n => n.id !== targetTask.assignedNodeId);
      this.flowEdges = this.flowEdges.filter(
        e => e.sourceNodeId !== targetTask.assignedNodeId && e.targetNodeId !== targetTask.assignedNodeId
      );
    }

    this.setLiveAnnouncement(`Task deleted: "${targetTask.title}". Undo available for 5 seconds.`);
  }

  undoDelete() {
    if (!this.undoToast) return;
    const { type, entity } = this.undoToast;

    if (type === 'TASK') {
      this.tasks.unshift(entity);
      if (entity.assignedNodeId) {
        // Re-create node
        this.flowNodes.push({
          id: entity.assignedNodeId,
          canvasId: 'main-canvas',
          type: 'taskNode',
          position: { x: 200, y: 200 },
          data: { label: entity.title, refEntityId: entity.id, status: entity.status },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isArchived: false
        });
      }
      this.setLiveAnnouncement(`Restored task: "${entity.title}"`);
    }

    this.undoToast = null;
    if (this.undoTimeout) clearTimeout(this.undoTimeout);
    this.notify();
  }

  // --- EVENT OPERATIONS ---
  createEvent(eventData) {
    const eventId = generateUUID();
    const now = new Date().toISOString();

    const newEvent = {
      id: eventId,
      title: eventData.title || 'Untitled Event',
      category: eventData.category || 'meeting',
      customCategoryName: eventData.customCategoryName || '',
      startDate: eventData.startDate || now,
      endDate: eventData.endDate || now,
      locationType: eventData.locationType || 'virtual',
      locationDetails: eventData.locationDetails || { meetingUrl: 'https://meet.jit.si/steady-room' },
      linkedTaskIds: eventData.linkedTaskIds || [],
      linkedFlowNodeIds: eventData.linkedFlowNodeIds || [],
      tagIds: eventData.tagIds || [],
      attendeesCount: eventData.attendeesCount || 1,
      createdAt: now,
      updatedAt: now,
      isArchived: false
    };

    this.events.unshift(newEvent);
    this.setLiveAnnouncement(`Event created: "${newEvent.title}" (${newEvent.category})`);
    return newEvent;
  }

  updateEvent(eventId, updates) {
    const now = new Date().toISOString();
    this.events = this.events.map(evt => {
      if (evt.id !== eventId) return evt;
      return { ...evt, ...updates, updatedAt: now };
    });
    this.notify();
  }

  deleteEvent(eventId) {
    const target = this.events.find(e => e.id === eventId);
    if (!target) return;

    this.events = this.events.filter(e => e.id !== eventId);

    // Sever linked task references
    this.tasks = this.tasks.map(t => ({
      ...t,
      linkedEventIds: t.linkedEventIds.filter(id => id !== eventId)
    }));

    this.setLiveAnnouncement(`Event deleted: "${target.title}"`);
  }

  // Add Task from inside an Event context
  addTaskToEvent(eventId, taskData) {
    const createdTask = this.createTask(taskData, { eventId, createFlowNode: true });
    this.setLiveAnnouncement(`Added task "${createdTask.title}" to event.`);
    return createdTask;
  }

  // --- FLOW CANVAS OPERATIONS ---
  createFlowNode(nodeData) {
    const nodeId = generateUUID();
    const now = new Date().toISOString();

    const newNode = {
      id: nodeId,
      canvasId: nodeData.canvasId || 'main-canvas',
      type: nodeData.type || 'taskNode',
      position: nodeData.position || { x: 250, y: 150 },
      data: nodeData.data || { label: 'New Node' },
      createdAt: now,
      updatedAt: now,
      isArchived: false
    };

    this.flowNodes.push(newNode);
    this.notify();
    return newNode;
  }

  updateNodePosition(nodeId, position) {
    this.flowNodes = this.flowNodes.map(n =>
      n.id === nodeId ? { ...n, position, updatedAt: new Date().toISOString() } : n
    );
    this.notify();
  }

  deleteFlowNode(nodeId) {
    const target = this.flowNodes.find(n => n.id === nodeId);
    if (!target) return;

    // Node deletion preserves primary database entity (Task/Event) but severs graph edges
    this.flowNodes = this.flowNodes.filter(n => n.id !== nodeId);
    this.flowEdges = this.flowEdges.filter(e => e.sourceNodeId !== nodeId && e.targetNodeId !== nodeId);

    this.setLiveAnnouncement(`Flow node deleted: "${target.data.label}". Linked entity preserved.`);
  }

  createFlowEdge(sourceNodeId, targetNodeId, conditionLabel = '') {
    const edgeId = generateUUID();
    const now = new Date().toISOString();

    const newEdge = {
      id: edgeId,
      canvasId: 'main-canvas',
      sourceNodeId,
      targetNodeId,
      conditionLabel,
      animated: true,
      createdAt: now,
      updatedAt: now,
      isArchived: false
    };

    this.flowEdges.push(newEdge);
    this.setLiveAnnouncement('Connected graph flow edge.');
    return newEdge;
  }

  deleteFlowEdge(edgeId) {
    this.flowEdges = this.flowEdges.filter(e => e.id !== edgeId);
    this.notify();
  }

  // Convert Task or Event into Canvas Node via drag-and-drop or action
  convertEntityToNode(entityType, entityId, position = { x: 300, y: 200 }) {
    const now = new Date().toISOString();
    const nodeId = generateUUID();

    if (entityType === 'task') {
      const task = this.tasks.find(t => t.id === entityId);
      if (!task) return;

      const newNode = {
        id: nodeId,
        canvasId: 'main-canvas',
        type: 'taskNode',
        position,
        data: { label: task.title, refEntityId: task.id, status: task.status, category: task.category },
        createdAt: now,
        updatedAt: now,
        isArchived: false
      };

      this.flowNodes.push(newNode);
      this.updateTask(task.id, { assignedNodeId: nodeId });
    } else if (entityType === 'event') {
      const event = this.events.find(e => e.id === entityId);
      if (!event) return;

      const newNode = {
        id: nodeId,
        canvasId: 'main-canvas',
        type: 'eventNode',
        position,
        data: { label: event.title, refEntityId: event.id, status: 'event', category: event.category },
        createdAt: now,
        updatedAt: now,
        isArchived: false
      };

      this.flowNodes.push(newNode);
      this.events = this.events.map(e =>
        e.id === event.id ? { ...e, linkedFlowNodeIds: [...e.linkedFlowNodeIds, nodeId] } : e
      );
    }
    this.setLiveAnnouncement('Converted entity into interactive flow canvas node.');
  }
}
