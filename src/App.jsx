import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import Navbar from './components/Navbar';
import Navigation from './components/Navigation';
import DashboardView from './components/DashboardView';
import TasksView from './components/TasksView';
import TaskCardMicroInteraction from './components/TaskCardMicroInteraction';
import FlowCanvasView from './components/FlowCanvasView';
import EventCalendarView from './components/EventCalendarView';
import PinboardView from './components/PinboardView';
import AnalyticsView from './components/AnalyticsView';
import TaskModal from './components/TaskModal';
import NewTaskModal from './components/NewTaskModal';
import NewPinModal from './components/NewPinModal';
import ContextualDrawer from './components/ContextualDrawer';
import { ReactiveWorkspaceEngine, INITIAL_TAGS, INITIAL_EVENTS, INITIAL_FLOW_NODES, INITIAL_FLOW_EDGES } from './store/reactiveStore';
import { INITIAL_TASKS, INITIAL_PINBOARD, INITIAL_REFLECTION } from './utils/storage';
import { playSuccessChime, playSoftClick } from './utils/audio';
import { RotateCcw, Sparkles } from 'lucide-react';

// Instantiate reactive store engine
const initialTaskData = (() => {
  const saved = localStorage.getItem('steady_tasks');
  return saved ? JSON.parse(saved) : INITIAL_TASKS;
})();

const workspaceEngine = new ReactiveWorkspaceEngine({
  tags: INITIAL_TAGS,
  tasks: initialTaskData,
  events: INITIAL_EVENTS,
  flowNodes: INITIAL_FLOW_NODES,
  flowEdges: INITIAL_FLOW_EDGES
});

export default function App() {
  // Theme & Settings
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('steady_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('steady_sound_enabled');
    return saved ? JSON.parse(saved) : true;
  });

  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeCategory, setActiveCategory] = useState('all');

  // Subscribe to Reactive Engine updates
  const [, setStoreVersion] = useState(0);
  useEffect(() => {
    return workspaceEngine.subscribe(() => {
      setStoreVersion(v => v + 1);
    });
  }, []);

  const tasks = workspaceEngine.tasks;
  const events = workspaceEngine.events;
  const flowNodes = workspaceEngine.flowNodes;
  const flowEdges = workspaceEngine.flowEdges;
  const undoToast = workspaceEngine.undoToast;
  const liveAnnouncement = workspaceEngine.liveAnnouncement;

  // Active Task for Timer
  const [activeTask, setActiveTask] = useState(() => tasks[0] || null);

  // Pinboard State
  const [pinboardItems, setPinboardItems] = useState(() => {
    const saved = localStorage.getItem('steady_pinboard');
    return saved ? JSON.parse(saved) : INITIAL_PINBOARD;
  });

  // Reflection State
  const [reflection, setReflection] = useState(() => {
    const saved = localStorage.getItem('steady_reflection');
    return saved ? JSON.parse(saved) : INITIAL_REFLECTION;
  });

  // Pomodoro Timer State
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState('focus');
  const [completedSessions, setCompletedSessions] = useState(2);

  // Modals & Drawers
  const [taskModalTask, setTaskModalTask] = useState(null);
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const [newPinModalOpen, setNewPinModalOpen] = useState(false);

  // Contextual Drawer State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerEntity, setDrawerEntity] = useState(null);
  const [drawerEntityType, setDrawerEntityType] = useState('task');

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('steady_dark_mode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('steady_sound_enabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('steady_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('steady_pinboard', JSON.stringify(pinboardItems));
  }, [pinboardItems]);

  useEffect(() => {
    localStorage.setItem('steady_reflection', JSON.stringify(reflection));
  }, [reflection]);

  // Pomodoro countdown tick
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      playSuccessChime(soundEnabled);
      if (timerMode === 'focus') {
        setCompletedSessions(c => c + 1);
        if (activeTask) {
          workspaceEngine.updateTask(activeTask.id, {
            completedBlocks: (activeTask.completedBlocks || 0) + 1
          });
        }
        setTimerMode('break');
        setTimerSeconds(5 * 60);
      } else {
        setTimerMode('focus');
        setTimerSeconds(25 * 60);
      }
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, timerMode, activeTask, soundEnabled]);

  // Handlers
  const handleToggleSubtask = (taskId, subtaskId) => {
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask) return;

    const updatedSubtasks = targetTask.subtasks.map(st =>
      st.id === subtaskId ? { ...st, done: !st.done } : st
    );

    workspaceEngine.updateTask(taskId, { subtasks: updatedSubtasks });
  };

  const handleToggleTaskStatus = (taskId, newStatus) => {
    workspaceEngine.updateTask(taskId, { status: newStatus });
  };

  const handleAddTask = (newTaskData) => {
    const created = workspaceEngine.createTask(newTaskData, { createFlowNode: true });
    setActiveTask(created);
  };

  const handleUpdateTask = (updatedTask) => {
    workspaceEngine.updateTask(updatedTask.id, updatedTask);
  };

  const handleDeleteTask = (taskId) => {
    workspaceEngine.deleteTask(taskId, true);
    if (activeTask?.id === taskId) {
      setActiveTask(tasks.find(t => t.id !== taskId) || null);
    }
  };

  const openContextualDrawer = (entity, type) => {
    playSoftClick(soundEnabled);
    setDrawerEntity(entity);
    setDrawerEntityType(type);
    setDrawerOpen(true);
  };

  // Dynamic styling tokens
  const neuCardClass = darkMode
    ? 'bg-[#1A1A1C] shadow-neu-dark text-[#F9F9F7] border border-[#374151]/30'
    : 'bg-[#F9F9F7] shadow-neu-light text-[#1F2937] border border-[#E5E7EB]/40';

  const neuInsetClass = darkMode
    ? 'bg-[#1A1A1C] shadow-neu-dark-inset text-[#F9F9F7]'
    : 'bg-[#F9F9F7] shadow-neu-light-inset text-[#1F2937]';

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans bg-noise ${
      darkMode ? 'bg-[#1A1A1C] text-[#F9F9F7]' : 'bg-[#F9F9F7] text-[#1F2937]'
    }`}>
      {/* Screen Reader WCAG Live Announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveAnnouncement}
      </div>

      {/* Page 0: Splash / Loading Screen */}
      {showSplash && (
        <SplashScreen
          darkMode={darkMode}
          onComplete={() => setShowSplash(false)}
        />
      )}

      {/* Top Navbar */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenNewTask={() => setNewTaskModalOpen(true)}
        onReplaySplash={() => setShowSplash(true)}
        neuCardClass={neuCardClass}
      />

      {/* Global Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        soundEnabled={soundEnabled}
        neuCardClass={neuCardClass}
        neuInsetClass={neuInsetClass}
      />

      {/* 5-Second Undo Toast Banner */}
      {undoToast && (
        <div className="fixed top-20 right-6 z-50 animate-bounce">
          <div className={`p-4 rounded-2xl ${neuCardClass} shadow-2xl border border-amber-500/40 flex items-center gap-3 text-xs`}>
            <span className="font-semibold text-amber-500 flex items-center gap-1">
              <Sparkles size={14} /> Item Removed
            </span>
            <button
              onClick={() => workspaceEngine.undoDelete()}
              className="px-3 py-1.5 bg-amber-500 text-white font-bold rounded-lg flex items-center gap-1 neu-button"
            >
              <RotateCcw size={12} /> Undo
            </button>
          </div>
        </div>
      )}

      {/* Main View Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-24 md:pb-16 pt-2">
        {activeTab === 'dashboard' && (
          <DashboardView
            tasks={tasks}
            activeTask={activeTask}
            setActiveTask={setActiveTask}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            onToggleSubtask={handleToggleSubtask}
            onOpenTaskModal={(task) => setTaskModalTask(task)}
            onOpenNewTask={() => setNewTaskModalOpen(true)}
            timerSeconds={timerSeconds}
            isTimerRunning={isTimerRunning}
            setIsTimerRunning={setIsTimerRunning}
            timerMode={timerMode}
            setTimerMode={setTimerMode}
            setTimerSeconds={setTimerSeconds}
            completedSessions={completedSessions}
            soundEnabled={soundEnabled}
            darkMode={darkMode}
            neuCardClass={neuCardClass}
            neuInsetClass={neuInsetClass}
          />
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <TasksView
              tasks={tasks}
              activeTask={activeTask}
              setActiveTask={setActiveTask}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              onToggleSubtask={handleToggleSubtask}
              onOpenTaskModal={(task) => setTaskModalTask(task)}
              onOpenNewTask={() => setNewTaskModalOpen(true)}
              setIsTimerRunning={setIsTimerRunning}
              soundEnabled={soundEnabled}
              darkMode={darkMode}
              neuCardClass={neuCardClass}
              neuInsetClass={neuInsetClass}
            />

            {/* Quick Interactive Checklist Section */}
            <div className="pt-6 border-t border-gray-200/40 dark:border-gray-800/40 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold font-display flex items-center gap-2">
                    <Sparkles size={18} className="text-[#5DA8A8]" /> Quick Execution Cards
                  </h3>
                  <p className={`text-xs ${darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                    Tap a card to view details or check off completion.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tasks.map(task => (
                  <TaskCardMicroInteraction
                    key={task.id}
                    task={task}
                    onToggleComplete={(id, newStatus) => handleToggleTaskStatus(id, newStatus)}
                    onOpenDrawer={(t) => openContextualDrawer(t, 'task')}
                    soundEnabled={soundEnabled}
                    darkMode={darkMode}
                    neuCardClass={neuCardClass}
                    neuInsetClass={neuInsetClass}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'flow' && (
          <FlowCanvasView
            flowNodes={flowNodes}
            flowEdges={flowEdges}
            tasks={tasks}
            events={events}
            onNodePositionChange={(id, pos) => workspaceEngine.updateNodePosition(id, pos)}
            onCreateNode={(data) => workspaceEngine.createFlowNode(data)}
            onDeleteNode={(id) => workspaceEngine.deleteFlowNode(id)}
            onCreateEdge={(src, tgt, label) => workspaceEngine.createFlowEdge(src, tgt, label)}
            onDeleteEdge={(id) => workspaceEngine.deleteFlowEdge(id)}
            onConvertEntityToNode={(type, id, pos) => workspaceEngine.convertEntityToNode(type, id, pos)}
            soundEnabled={soundEnabled}
            darkMode={darkMode}
            neuCardClass={neuCardClass}
            neuInsetClass={neuInsetClass}
          />
        )}

        {activeTab === 'events' && (
          <EventCalendarView
            events={events}
            tasks={tasks}
            onCreateEvent={(evtData) => workspaceEngine.createEvent(evtData)}
            onAddTaskToEvent={(evtId, tData) => workspaceEngine.addTaskToEvent(evtId, tData)}
            onOpenEventDrawer={(evt) => openContextualDrawer(evt, 'event')}
            soundEnabled={soundEnabled}
            darkMode={darkMode}
            neuCardClass={neuCardClass}
            neuInsetClass={neuInsetClass}
          />
        )}

        {activeTab === 'pinboard' && (
          <PinboardView
            pinboardItems={pinboardItems}
            onOpenNewPin={() => setNewPinModalOpen(true)}
            onDeletePin={(id) => setPinboardItems(prev => prev.filter(p => p.id !== id))}
            soundEnabled={soundEnabled}
            darkMode={darkMode}
            neuCardClass={neuCardClass}
            neuInsetClass={neuInsetClass}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            tasks={tasks}
            completedSessions={completedSessions}
            reflection={reflection}
            setReflection={setReflection}
            onRolloverTasks={() => {
              setReflection(prev => ({ ...prev, rolledOverTasksCount: tasks.filter(t => t.status !== 'completed').length }));
            }}
            soundEnabled={soundEnabled}
            darkMode={darkMode}
            neuCardClass={neuCardClass}
            neuInsetClass={neuInsetClass}
          />
        )}
      </main>

      {/* Task Modal */}
      {taskModalTask && (
        <TaskModal
          task={taskModalTask}
          onClose={() => setTaskModalTask(null)}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          onStartSession={(task) => {
            setActiveTask(task);
            setIsTimerRunning(true);
            setActiveTab('dashboard');
          }}
          soundEnabled={soundEnabled}
          darkMode={darkMode}
          neuCardClass={neuCardClass}
          neuInsetClass={neuInsetClass}
        />
      )}

      {/* New Task Modal */}
      {newTaskModalOpen && (
        <NewTaskModal
          onClose={() => setNewTaskModalOpen(false)}
          onAddTask={handleAddTask}
          soundEnabled={soundEnabled}
          darkMode={darkMode}
          neuCardClass={neuCardClass}
          neuInsetClass={neuInsetClass}
        />
      )}

      {/* New Pin Modal */}
      {newPinModalOpen && (
        <NewPinModal
          onClose={() => setNewPinModalOpen(false)}
          onAddPin={(pin) => setPinboardItems(prev => [pin, ...prev])}
          soundEnabled={soundEnabled}
          darkMode={darkMode}
          neuCardClass={neuCardClass}
          neuInsetClass={neuInsetClass}
        />
      )}

      {/* Contextual Side-Drawer Panel */}
      <ContextualDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        entity={drawerEntity}
        entityType={drawerEntityType}
        onUpdateEntity={(updated) => {
          if (drawerEntityType === 'task') workspaceEngine.updateTask(updated.id, updated);
          if (drawerEntityType === 'event') workspaceEngine.updateEvent(updated.id, updated);
        }}
        onDeleteEntity={(id) => {
          if (drawerEntityType === 'task') workspaceEngine.deleteTask(id, true);
          if (drawerEntityType === 'event') workspaceEngine.deleteEvent(id);
          if (drawerEntityType === 'node') workspaceEngine.deleteFlowNode(id);
        }}
        soundEnabled={soundEnabled}
        darkMode={darkMode}
        neuCardClass={neuCardClass}
        neuInsetClass={neuInsetClass}
      />
    </div>
  );
}
