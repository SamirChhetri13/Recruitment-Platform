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
import { FileText, Calendar, GripVertical, CheckCircle, RotateCcw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { APPLICATION_STATUSES } from '../../utils/constants';
import { formatDateAgo } from '../../utils/helpers';
import { Avatar, Badge } from '../ui';

const STATUS_TOP_BORDERS = {
  applied: 'border-t-status-applied',
  shortlisted: 'border-t-status-shortlisted',
  hired: 'border-t-status-hired',
  rejected: 'border-t-status-rejected',
};

// Droppable Column Component
const KanbanColumn = ({ column, children, count }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.value,
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        bg-white dark:bg-ink-900 
        border border-ink-100 dark:border-ink-800 
        border-t-4 ${STATUS_TOP_BORDERS[column.value] || 'border-t-brand-600'}
        rounded-2xl shadow-card 
        flex flex-col 
        min-h-[460px] max-h-[640px] transition-all duration-150
        ${isOver ? 'bg-brand-50/50 dark:bg-brand-950/40 border-brand-400 ring-2 ring-brand-500/20' : ''}
      `}
    >
      {/* Sticky Column Header */}
      <div className="sticky top-0 z-10 px-4 py-3 bg-white/95 dark:bg-ink-900/95 backdrop-blur-sm border-b border-ink-100 dark:border-ink-800 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant={column.value} size="md">
            {column.label}
          </Badge>
        </div>
        <span className="w-5 h-5 rounded-full bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300 font-bold text-2xs flex items-center justify-center">
          {count}
        </span>
      </div>

      {/* Cards Scrollable Body */}
      <div className="p-3 space-y-3 flex-1 overflow-y-auto custom-scrollbar">
        {count === 0 ? (
          <div className="py-12 text-center text-xs text-ink-400 dark:text-ink-500 italic border-2 border-dashed border-ink-200 dark:border-ink-800 rounded-xl">
            Drop applicants here
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

// Draggable Candidate Card
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
      onClick={() => onSelectCandidate(app)}
      className={`
        p-4 rounded-xl 
        bg-surface-muted dark:bg-surface-dark-muted 
        hover:bg-white dark:hover:bg-ink-800/80 
        border border-ink-100 dark:border-ink-800 
        hover:border-brand-200 dark:hover:border-brand-800/60
        shadow-2xs hover:shadow-card
        space-y-3 transition-all duration-150 cursor-pointer group
        ${isDragging ? 'opacity-30 border-brand-500 scale-95 shadow-lift z-50' : ''}
      `}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <Avatar name={app.candidate?.name} size="sm" />
          <div className="overflow-hidden">
            <h5 className="text-xs font-bold text-ink-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors truncate">
              {app.candidate?.name || 'Candidate'}
            </h5>
            <p className="text-2xs text-ink-500 dark:text-ink-400 truncate">{app.candidate?.email}</p>
          </div>
        </div>

        {/* Drag handle */}
        <div
          {...listeners}
          {...attributes}
          className="p-1 text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 cursor-grab active:cursor-grabbing rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800 shrink-0"
          title="Drag to reorder status"
          onClick={(e) => e.stopPropagation()}
          aria-label="Drag candidate card"
        >
          <GripVertical className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-center justify-between text-2xs text-ink-500 dark:text-ink-400 pt-1 border-t border-ink-100 dark:border-ink-800">
        <span className="flex items-center gap-1 font-medium">
          <Calendar className="w-3 h-3 text-ink-400" />
          {formatDateAgo(app.createdAt)}
        </span>
        
        {app.resumeUrl && (
          <span className="text-brand-600 dark:text-brand-300 flex items-center gap-1 font-semibold bg-brand-50 dark:bg-brand-950 px-1.5 py-0.5 rounded-md">
            <FileText className="w-3 h-3" />
            Resume
          </span>
        )}
      </div>

      {/* Accessible Mobile Fallback Selector */}
      <div className="pt-1" onClick={(e) => e.stopPropagation()}>
        <select
          aria-label="Move applicant status"
          value={app.status}
          onChange={(e) => onStatusChange(app._id, e.target.value)}
          className="w-full text-2xs py-1 px-2 rounded-lg border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 text-ink-800 dark:text-ink-100 font-semibold cursor-pointer"
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
      const previousStatus = app.status;
      
      // Perform status change
      onStatusChange(appId, targetStatus);

      // Trigger Toast notification with Undo action
      toast((t) => (
        <div className="flex items-center gap-3 text-xs font-semibold text-ink-900 dark:text-white">
          <CheckCircle className="w-4 h-4 text-status-hired" />
          <span>Moved <strong>{app.candidate?.name || 'Candidate'}</strong> to {targetStatus}</span>
          <button
            onClick={() => {
              onStatusChange(appId, previousStatus);
              toast.dismiss(t.id);
              toast.success(`Reverted back to ${previousStatus}`);
            }}
            className="flex items-center gap-1 text-2xs font-bold text-brand-600 dark:text-brand-300 hover:underline ml-auto"
          >
            <RotateCcw className="w-3 h-3" />
            Undo
          </button>
        </div>
      ), { duration: 4000 });
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
          <div className="p-4 rounded-xl bg-white dark:bg-ink-900 border-2 border-brand-500 shadow-lift space-y-3 opacity-95 pointer-events-none w-72">
            <div className="flex items-center gap-2.5">
              <Avatar name={activeApp.candidate?.name} size="sm" />
              <div className="overflow-hidden">
                <h5 className="text-xs font-bold text-ink-900 dark:text-white truncate">
                  {activeApp.candidate?.name || 'Candidate'}
                </h5>
                <p className="text-2xs text-brand-600 dark:text-brand-300 truncate">{activeApp.candidate?.email}</p>
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default ApplicantKanban;
