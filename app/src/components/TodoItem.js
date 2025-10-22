import React from 'react';
import { CheckCircleIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';

const TodoItem = ({ todo, onToggle, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const isOverdue = (dateString) => {
    if (!dateString) return false;
    const dueDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today && !todo.completed;
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow ${
      todo.completed ? 'opacity-75' : ''
    }`}>
      <div className="flex items-start space-x-3">
        <button
          onClick={() => onToggle(todo.id, !todo.completed)}
          className="mt-1 text-gray-400 hover:text-indigo-600 transition-colors"
        >
          {todo.completed ? (
            <CheckCircleIconSolid className="h-5 w-5 text-green-500" />
          ) : (
            <CheckCircleIcon className="h-5 w-5" />
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-medium text-gray-900 ${
            todo.completed ? 'line-through' : ''
          }`}>
            {todo.title}
          </h3>
          
          {todo.description && (
            <p className={`mt-1 text-sm text-gray-500 ${
              todo.completed ? 'line-through' : ''
            }`}>
              {todo.description}
            </p>
          )}
          
          <div className="mt-2 flex items-center justify-between">
            <span className={`text-xs ${
              isOverdue(todo.due_date) 
                ? 'text-red-600 font-medium' 
                : 'text-gray-500'
            }`}>
              {formatDate(todo.due_date)}
            </span>
            
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(todo)}
                className="text-gray-400 hover:text-indigo-600 transition-colors"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(todo.id)}
                className="text-gray-400 hover:text-red-600 transition-colors"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;