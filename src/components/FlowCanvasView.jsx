import React, { useState, useRef } from 'react';
import { Plus, ZoomIn, ZoomOut, RefreshCw, Sparkles, Move, Trash2, Link, ArrowRight, Play, CheckCircle2, AlertCircle } from 'lucide-react';
import { playSoftClick, playSuccessChime } from '../utils/audio';

export default function FlowCanvasView({
  flowNodes,
  flowEdges,
  tasks,
  events,
  onNodePositionChange,
  onCreateNode,
  onDeleteNode,
  onCreateEdge,
  onDeleteEdge,
  onConvertEntityToNode,
  soundEnabled,
  darkMode,
  neuCardClass,
  neuInsetClass
}) {
  const canvasRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [connectSourceId, setConnectSourceId] = useState(null);
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);

  const handleMouseDownNode = (e, nodeId, nodePos) => {
    e.stopPropagation();
    playSoftClick(soundEnabled);
    setDraggingNodeId(nodeId);
    setSelectedNodeId(nodeId);

    const canvasRect = canvasRef.current.getBoundingClientRect();
    setDragOffset({
      x: (e.clientX - canvasRect.left) / zoom - nodePos.x,
      y: (e.clientY - canvasRect.top) / zoom - nodePos.y
    });
  };

  const handleMouseMoveCanvas = (e) => {
    if (!draggingNodeId || !canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();

    const newX = Math.max(20, Math.round((e.clientX - canvasRect.left) / zoom - dragOffset.x));
    const newY = Math.max(20, Math.round((e.clientY - canvasRect.top) / zoom - dragOffset.y));

    onNodePositionChange(draggingNodeId, { x: newX, y: newY });
  };

  const handleMouseUpCanvas = () => {
    if (draggingNodeId) {
      setDraggingNodeId(null);
    }
  };

  const handleNodeClickForConnect = (nodeId) => {
    if (!connectSourceId) {
      setConnectSourceId(nodeId);
      playSoftClick(soundEnabled);
    } else if (connectSourceId !== nodeId) {
      playSuccessChime(soundEnabled);
      onCreateEdge(connectSourceId, nodeId, 'Flow Connection');
      setConnectSourceId(null);
    } else {
      setConnectSourceId(null);
    }
  };

  const getNodeColor = (type) => {
    switch (type) {
      case 'taskNode': return '#5DA8A8';
      case 'eventNode': return '#3B82F6';
      case 'milestoneNode': return '#10B981';
      case 'decisionNode': return '#F59E0B';
      default: return '#8B5CF6';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Canvas Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl neuCardClass bg-[#5DA8A8]/5 border border-[#5DA8A8]/20">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs font-bold uppercase tracking-wider text-[#5DA8A8]">
            <Sparkles size={16} /> Reactive Flow Canvas Engine
          </div>
          <h2 className="text-2xl font-bold tracking-tight font-display">
            Interconnected Process Map
          </h2>
          <p className={`text-xs mt-0.5 ${darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
            Interactive nodes linked bidirectionally to Tasks and Events. Drag nodes to reorder execution graphs.
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded-xl flex items-center gap-1 ${neuCardClass}`}>
            <button
              onClick={() => setZoom(z => Math.min(1.6, z + 0.1))}
              className="p-2 rounded-lg text-xs hover:text-[#5DA8A8] neu-button"
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
            <span className="text-xs font-mono px-2 font-bold">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom(z => Math.max(0.6, z - 0.1))}
              className="p-2 rounded-lg text-xs hover:text-[#5DA8A8] neu-button"
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-2 rounded-lg text-xs hover:text-[#5DA8A8] neu-button"
              title="Reset Zoom"
            >
              <RefreshCw size={16} />
            </button>
          </div>

          <button
            onClick={() => setShowAddNodeModal(true)}
            className="px-4 py-2.5 bg-[#5DA8A8] hover:bg-[#4E9393] text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5 shadow-sm neu-button"
          >
            <Plus size={16} /> Add Node
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div
        ref={canvasRef}
        onMouseMove={handleMouseMoveCanvas}
        onMouseUp={handleMouseUpCanvas}
        onMouseLeave={handleMouseUpCanvas}
        className={`relative w-full h-[540px] rounded-3xl overflow-hidden cursor-crosshair select-none bg-noise transition-colors border border-[#E2E8F0] dark:border-[#27272A] ${
          darkMode ? 'bg-[#161618]' : 'bg-[#F4F4F0]'
        }`}
      >
        <div
          className="absolute inset-0 origin-top-left transition-transform duration-75"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* SVG Connector Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#5DA8A8" />
              </marker>
            </defs>

            {flowEdges.map(edge => {
              const srcNode = flowNodes.find(n => n.id === edge.sourceNodeId);
              const tgtNode = flowNodes.find(n => n.id === edge.targetNodeId);
              if (!srcNode || !tgtNode) return null;

              const x1 = srcNode.position.x + 100;
              const y1 = srcNode.position.y + 40;
              const x2 = tgtNode.position.x + 100;
              const y2 = tgtNode.position.y + 40;

              const dx = x2 - x1;
              const dy = y2 - y1;
              const cx1 = x1 + dx * 0.5;
              const cy1 = y1;
              const cx2 = x1 + dx * 0.5;
              const cy2 = y2;

              const pathString = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;

              return (
                <g key={edge.id}>
                  <path
                    d={pathString}
                    stroke="#5DA8A8"
                    strokeWidth="2.5"
                    strokeDasharray={edge.animated ? '6,6' : 'none'}
                    fill="none"
                    markerEnd="url(#arrow)"
                    className={edge.animated ? 'animate-pulse' : ''}
                  />
                  {edge.conditionLabel && (
                    <text
                      x={(x1 + x2) / 2}
                      y={(y1 + y2) / 2 - 8}
                      fill="#5DA8A8"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="bg-white px-1 font-mono"
                    >
                      {edge.conditionLabel}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Interactive Flow Nodes */}
          {flowNodes.map(node => {
            const isSelected = selectedNodeId === node.id;
            const isConnectSource = connectSourceId === node.id;
            const linkedTask = tasks.find(t => t.id === node.data.refEntityId);
            const isTaskCompleted = linkedTask?.status === 'completed';

            return (
              <div
                key={node.id}
                onMouseDown={(e) => handleMouseDownNode(e, node.id, node.position)}
                className={`absolute w-52 p-4 rounded-2xl transition-all duration-150 ${neuCardClass} z-20 border border-[#E2E8F0] dark:border-[#27272A] cursor-grab active:cursor-grabbing ${
                  isSelected ? 'ring-2 ring-[#5DA8A8] shadow-2xl' : ''
                } ${isConnectSource ? 'ring-2 ring-amber-400 animate-pulse' : ''} ${
                  isTaskCompleted ? 'ring-2 ring-emerald-500 shadow-emerald-500/20 animate-pulse' : ''
                }`}
                style={{
                  left: `${node.position.x}px`,
                  top: `${node.position.y}px`
                }}
              >
                {/* Type Indicator Tag */}
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: getNodeColor(node.type) }}
                  >
                    {node.type.replace('Node', '')}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNodeClickForConnect(node.id);
                      }}
                      className="p-1 rounded text-gray-400 hover:text-[#5DA8A8]"
                      title="Connect to another node"
                    >
                      <Link size={12} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNode(node.id);
                      }}
                      className="p-1 rounded text-gray-400 hover:text-rose-500"
                      title="Delete Node"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                <h4 className="text-xs font-bold font-display line-clamp-2 mb-2">
                  {node.data.label}
                </h4>

                {linkedTask && (
                  <div className="text-[10px] font-semibold flex items-center justify-between opacity-80 border-t border-gray-200/30 pt-1.5">
                    <span>Task Status:</span>
                    <span className={isTaskCompleted ? 'text-emerald-500 font-bold' : 'text-[#5DA8A8]'}>
                      {linkedTask.status}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Unlinked Entities Drop Target / Converter Ribbon */}
      <div className={`p-5 rounded-3xl ${neuCardClass} space-y-3`}>
        <h3 className="text-sm font-bold font-display flex items-center gap-2">
          <Link size={16} className="text-[#5DA8A8]" /> Quick-Convert Unlinked Entities to Flow Nodes
        </h3>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {tasks.filter(t => !t.assignedNodeId).map(t => (
            <button
              key={t.id}
              onClick={() => {
                playSoftClick(soundEnabled);
                onConvertEntityToNode('task', t.id, { x: 120 + Math.random() * 300, y: 150 + Math.random() * 150 });
              }}
              className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap neu-button ${neuInsetClass} hover:text-[#5DA8A8]`}
            >
              + Convert Task: "{t.title.slice(0, 20)}..."
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
