
import React from 'react';
import { Column as ColumnType, Task } from '../types';
import TaskCard from './TaskCard';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onTaskMove: (taskId: string, sourceColId: string, destColId: string, index: number) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const Column: React.FC<ColumnProps> = ({ column, tasks, onTaskMove, onEditTask, onDeleteTask }) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const sourceColId = e.dataTransfer.getData('sourceColId');
    if (taskId) {
      onTaskMove(taskId, sourceColId, column.id, tasks.length);
    }
  };

  return (
    <div 
      className="w-80 flex flex-col bg-slate-100 rounded-xl border border-slate-200 shadow-sm"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="p-4 flex items-center justify-between border-b border-slate-200 bg-white rounded-t-xl">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-slate-700">{column.title}</h2>
          <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        </button>
      </div>

      <div className="flex-1 p-3 overflow-y-auto custom-scrollbar flex flex-col gap-3 min-h-[500px]">
        {tasks.map((task, index) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))}
      </div>
    </div>
  );
};

export default Column;
