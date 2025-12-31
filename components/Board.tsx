
import React from 'react';
import { BoardData, Task } from '../types';
import Column from './Column';

interface BoardProps {
  data: BoardData;
  onTaskMove: (taskId: string, sourceColId: string, destColId: string, index: number) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const Board: React.FC<BoardProps> = ({ data, onTaskMove, onEditTask, onDeleteTask }) => {
  return (
    <div className="flex gap-6 h-full min-w-max pb-4">
      {data.columnOrder.map(columnId => {
        const column = data.columns[columnId];
        const tasks = column.taskIds.map(taskId => data.tasks[taskId]);
        return (
          <Column 
            key={column.id} 
            column={column} 
            tasks={tasks} 
            onTaskMove={onTaskMove}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
        );
      })}
    </div>
  );
};

export default Board;
