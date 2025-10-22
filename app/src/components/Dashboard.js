import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { todoService } from '../services/api';
import TodoItem from './TodoItem';
import TodoModal from './TodoModal';
import { PlusIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('open'); // 'open', 'completed', 'all'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [error, setError] = useState('');

  const loadTodos = async () => {
    try {
      setLoading(true);
      const completedParam = filter === 'open' ? false : filter === 'completed' ? true : null;
      const response = await todoService.getTodos(completedParam);
      setTodos(response.data);
    } catch (err) {
      setError('Failed to load todos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, [filter]);

  const handleCreateTodo = async (todoData) => {
    try {
      await todoService.createTodo(todoData);
      setIsModalOpen(false);
      loadTodos();
    } catch (err) {
      setError('Failed to create todo');
      console.error(err);
    }
  };

  const handleUpdateTodo = async (todoData) => {
    try {
      await todoService.updateTodo(editingTodo.id, todoData);
      setIsModalOpen(false);
      setEditingTodo(null);
      loadTodos();
    } catch (err) {
      setError('Failed to update todo');
      console.error(err);
    }
  };

  const handleToggleTodo = async (id, completed) => {
    try {
      await todoService.updateTodo(id, { completed });
      loadTodos();
    } catch (err) {
      setError('Failed to update todo');
      console.error(err);
    }
  };

  const handleDeleteTodo = async (id) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await todoService.deleteTodo(id);
        loadTodos();
      } catch (err) {
        setError('Failed to delete todo');
        console.error(err);
      }
    }
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const openTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">MyTodo</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user?.first_name} {user?.last_name}
              </span>
              <button
                onClick={logout}
                className="flex items-center text-gray-500 hover:text-gray-700"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-blue-600">{openTodosCount}</div>
            <div className="text-sm text-gray-600">Open Tasks</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-green-600">{completedTodosCount}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-gray-600">{todos.length}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('open')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'open' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Open ({openTodosCount})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'completed' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Completed ({completedTodosCount})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'all' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All ({todos.length})
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Todo</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="text-red-800">{error}</div>
          </div>
        )}

        {/* Todo List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Loading todos...</div>
            </div>
          ) : todos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">No todos found</div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Create your first todo
              </button>
            </div>
          ) : (
            todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggleTodo}
                onEdit={handleEditTodo}
                onDelete={handleDeleteTodo}
              />
            ))
          )}
        </div>
      </div>

      {/* Todo Modal */}
      <TodoModal
        isOpen={isModalOpen}
        onRequestClose={() => {
          setIsModalOpen(false);
          setEditingTodo(null);
        }}
        onSubmit={editingTodo ? handleUpdateTodo : handleCreateTodo}
        todo={editingTodo}
      />
    </div>
  );
};

export default Dashboard;