
import React from 'react';
import { Task, Priority } from '../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => {
  const styles = {
    low: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    medium: 'bg-amber-50 text-amber-700 border-amber-100',
    high: 'bg-rose-50 text-rose-700 border-rose-100',
  };

  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${styles[priority]}`}>
      {priority}
    </span>
  );
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.setData('sourceColId', task.status);
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50');
  };

  return (
    <div 
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-grab active:cursor-grabbing group"
    >
      <div className="flex justify-between items-start mb-2">
        <PriorityBadge priority={task.priority} />
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit(task)}
            className="p-1 text-slate-400 hover:text-blue-600 rounded"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button 
            onClick={() => onDelete(task.id)}
            className="p-1 text-slate-400 hover:text-rose-600 rounded"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      <h3 className="font-medium text-slate-900 mb-1 line-clamp-2">{task.title}</h3>
      <p className="text-slate-500 text-sm line-clamp-3 mb-3">{task.description}</p>
      
      <div className="flex items-center justify-between pt-3 border-t border-slate-50">
        <div className="flex -space-x-2">
          <img src={`https://picsum.photos/seed/${task.id}/32/32`} className="w-6 h-6 rounded-full border-2 border-white" alt="avatar" />
        </div>
        <div className="flex items-center text-slate-400 text-[10px] font-medium">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {new Date(task.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
