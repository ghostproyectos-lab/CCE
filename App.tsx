
import React, { useState, useEffect, useCallback } from 'react';
import { BoardData, Task, Column, Priority } from './types';
import Board from './components/Board';
import TaskModal from './components/TaskModal';
import AIAssistant from './components/AIAssistant';

const INITIAL_DATA: BoardData = {
  tasks: {
    'task-1': { id: 'task-1', title: 'Design Landing Page', description: 'Create high-fidelity mockups for the new homepage.', priority: 'high', status: 'todo', createdAt: Date.now() },
    'task-2': { id: 'task-2', title: 'User Research', description: 'Interview at least 5 potential users.', priority: 'medium', status: 'todo', createdAt: Date.now() - 10000 },
  },
  columns: {
    'todo': { id: 'todo', title: 'To Do', taskIds: ['task-1', 'task-2'] },
    'inprogress': { id: 'inprogress', title: 'In Progress', taskIds: [] },
    'review': { id: 'review', title: 'Review', taskIds: [] },
    'done': { id: 'done', title: 'Done', taskIds: [] },
  },
  columnOrder: ['todo', 'inprogress', 'review', 'done'],
};

const App: React.FC = () => {
  const [data, setData] = useState<BoardData>(() => {
    const saved = localStorage.getItem('kanban-data');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    localStorage.setItem('kanban-data', JSON.stringify(data));
  }, [data]);

  const onTaskMove = useCallback((taskId: string, sourceColId: string, destColId: string, index: number) => {
    setData(prev => {
      const sourceCol = prev.columns[sourceColId];
      const destCol = prev.columns[destColId];
      const newTaskIds = Array.from(sourceCol.taskIds);
      
      // Remove from source
      newTaskIds.splice(newTaskIds.indexOf(taskId), 1);
      
      const newSourceCol = { ...sourceCol, taskIds: newTaskIds };
      
      // If moving within same column
      if (sourceColId === destColId) {
        newTaskIds.splice(index, 0, taskId);
        return {
          ...prev,
          columns: { ...prev.columns, [sourceColId]: newSourceCol }
        };
      }
      
      // Moving to different column
      const newDestTaskIds = Array.from(destCol.taskIds);
      newDestTaskIds.splice(index, 0, taskId);
      const newDestCol = { ...destCol, taskIds: newDestTaskIds };
      
      // Update task status
      const updatedTask = { ...prev.tasks[taskId], status: destColId };

      return {
        ...prev,
        tasks: { ...prev.tasks, [taskId]: updatedTask },
        columns: {
          ...prev.columns,
          [sourceColId]: newSourceCol,
          [destColId]: newDestCol
        }
      };
    });
  }, []);

  const handleAddTask = (taskData: Partial<Task>) => {
    const id = `task-${Date.now()}`;
    const newTask: Task = {
      id,
      title: taskData.title || 'New Task',
      description: taskData.description || '',
      priority: taskData.priority || 'medium',
      status: 'todo',
      createdAt: Date.now(),
    };

    setData(prev => ({
      ...prev,
      tasks: { ...prev.tasks, [id]: newTask },
      columns: {
        ...prev.columns,
        todo: { ...prev.columns.todo, taskIds: [id, ...prev.columns.todo.taskIds] }
      }
    }));
    setIsModalOpen(false);
  };

  const handleUpdateTask = (taskData: Partial<Task>) => {
    if (!editingTask) return;
    setData(prev => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [editingTask.id]: { ...prev.tasks[editingTask.id], ...taskData }
      }
    }));
    setEditingTask(null);
    setIsModalOpen(false);
  };

  const handleDeleteTask = (taskId: string) => {
    setData(prev => {
      const task = prev.tasks[taskId];
      const colId = task.status;
      const newColTaskIds = prev.columns[colId].taskIds.filter(id => id !== taskId);
      const newTasks = { ...prev.tasks };
      delete newTasks[taskId];

      return {
        ...prev,
        tasks: newTasks,
        columns: {
          ...prev.columns,
          [colId]: { ...prev.columns[colId], taskIds: newColTaskIds }
        }
      };
    });
  };

  const handleAISuggestedTasks = (suggestedTasks: any[]) => {
    setData(prev => {
      const newTasks = { ...prev.tasks };
      const newTodoIds = [...prev.columns.todo.taskIds];

      suggestedTasks.forEach(t => {
        const id = `task-${Math.random().toString(36).substr(2, 9)}`;
        newTasks[id] = {
          id,
          title: t.title,
          description: t.description,
          priority: t.priority as Priority,
          status: 'todo',
          createdAt: Date.now(),
        };
        newTodoIds.unshift(id);
      });

      return {
        ...prev,
        tasks: newTasks,
        columns: {
          ...prev.columns,
          todo: { ...prev.columns.todo, taskIds: newTodoIds }
        }
      };
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Gemini Kanban Pro</h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Task
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-x-auto p-6 bg-slate-50">
        <Board 
          data={data} 
          onTaskMove={onTaskMove} 
          onEditTask={(task) => { setEditingTask(task); setIsModalOpen(true); }}
          onDeleteTask={handleDeleteTask}
        />
      </main>

      <AIAssistant onSuggestTasks={handleAISuggestedTasks} />

      {isModalOpen && (
        <TaskModal 
          isOpen={isModalOpen} 
          onClose={() => { setIsModalOpen(false); setEditingTask(null); }} 
          onSubmit={editingTask ? handleUpdateTask : handleAddTask}
          initialData={editingTask || undefined}
        />
      )}
    </div>
  );
};

export default App;
