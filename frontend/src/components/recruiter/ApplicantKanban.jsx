import React, { useState } from 'react';
import {
  DndContext,
  useDroppable,
  useDraggable,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import { Eye, FileText, ExternalLink, Calendar, GripVertical } from 'lucide-react';
import { APPLICATION_STATUSES } from '../../utils/constants';
import { formatDateAgo } from '../../utils/helpers';

// Droppable Kanban Column
const KanbanColumn = ({ column, children, count }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.value,
  });

  return (
    <div
      ref={setNodeRef}
      className={`glass-panel p-4 rounded-2xl border transition-colors flex flex-col space-y-3 min-h-[420px] ${
        isOver
          ? 'border-indigo-500/80 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
          : 'border-slate-800 bg-slate-900/60'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${column.color}`}>
          {column.label}
        </span>
        <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-bold text-[11px] flex items-center justify-center">
          {count}
        </span>
      </div>

      {/* Cards List */}
      <div className="space-y-3 flex-1 overflow-y-auto max-h-[550px] pr-1 custom-scrollbar">
        {count === 0 ? (
          <div className="py-12 text-center text-[11px] text-slate-500 italic border-2 border-dashed border-slate-800/80 rounded-xl">
            Drop applicants here
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

// Draggable Candidate Card Component
const DraggableCandidateCard = ({ app, onSelectCandidate, onStatusChange }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: app._id,
    data: { app },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 rounded-xl glass-panel bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 space-y-3 transition-all cursor-pointer group ${
        isDragging ? 'opacity-40 border-indigo-500 scale-95 shadow-2xl z-50' : ''
      }`}
      onClick={() => onSelectCandidate(app)}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow">
            {app.candidate?.name?.charAt(0) || 'C'}
          </div>
          <div className="overflow-hidden">
            <h5 className="text-xs font-bold text-slate-100 group-hover:text-indigo-400 transition-colors truncate">
              {app.candidate?.name || 'Candidate'}
            </h5>
            <p className="text-[10px] text-slate-400 truncate">{app.candidate?.email}</p>
          </div>
        </div>

        {/* Drag handle */}
        <div
          {...listeners}
          {...attributes}
          className="p-1 text-slate-500 hover:text-slate-200 cursor-grab active:cursor-grabbing rounded hover:bg-slate-700/50 shrink-0"
          title="Drag to reorder status"
          onClick={(e) => e.stopPropagation()}
          aria-label="Drag applicant card"
        >
          <GripVertical className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-700/50">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-slate-500" />
          {formatDateAgo(app.createdAt)}
        </span>
        
        {app.resumeUrl && (
          <span className="text-indigo-400 flex items-center gap-0.5 font-medium">
            <FileText className="w-3 h-3" />
            CV
          </span>
        )}
      </div>

      {/* Accessible Mobile Fallback Dropdown */}
      <div className="pt-1" onClick={(e) => e.stopPropagation()}>
        <select
          aria-label="Move applicant status"
          value={app.status}
          onChange={(e) => onStatusChange(app._id, e.target.value)}
          className="w-full text-[11px] py-1.5 px-2 rounded-lg bg-slate-900 text-slate-300 border border-slate-700 focus:outline-none cursor-pointer focus:ring-1 focus:ring-indigo-500"
        >
          {APPLICATION_STATUSES.map((st) => (
            <option key={st.value} value={st.value}>
              Move to {st.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export const ApplicantKanban = ({ applications, onSelectCandidate, onStatusChange }) => {
  const [activeApp, setActiveApp] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    })
  );

  const getApplicationsByStatus = (statusValue) => {
    return (applications || []).filter((app) => app.status === statusValue);
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const found = (applications || []).find((a) => a._id === active.id);
    if (found) {
      setActiveApp(found);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveApp(null);

    if (!over) return;

    const targetStatus = over.id;
    const appId = active.id;

    const app = (applications || []).find((a) => a._id === appId);
    if (app && app.status !== targetStatus) {
      onStatusChange(appId, targetStatus);
    }
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {APPLICATION_STATUSES.map((column) => {
          const columnApps = getApplicationsByStatus(column.value);

          return (
            <KanbanColumn key={column.value} column={column} count={columnApps.length}>
              {columnApps.map((app) => (
                <DraggableCandidateCard
                  key={app._id}
                  app={app}
                  onSelectCandidate={onSelectCandidate}
                  onStatusChange={onStatusChange}
                />
              ))}
            </KanbanColumn>
          );
        })}
      </div>

      <DragOverlay>
        {activeApp ? (
          <div className="p-4 rounded-xl glass-panel bg-slate-900 border-2 border-indigo-500 shadow-2xl space-y-3 opacity-95 pointer-events-none w-72">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {activeApp.candidate?.name?.charAt(0) || 'C'}
              </div>
              <div className="overflow-hidden">
                <h5 className="text-xs font-bold text-slate-100 truncate">
                  {activeApp.candidate?.name || 'Candidate'}
                </h5>
                <p className="text-[10px] text-indigo-400 truncate">{activeApp.candidate?.email}</p>
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

