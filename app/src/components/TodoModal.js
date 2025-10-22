import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import Modal from 'react-modal';
import "react-datepicker/dist/react-datepicker.css";

Modal.setAppElement('#root');

const TodoModal = ({ isOpen, onRequestClose, onSubmit, todo = null }) => {
  const [formData, setFormData] = useState({
    title: todo?.title || '',
    description: todo?.description || '',
    due_date: todo?.due_date ? new Date(todo.due_date) : null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      due_date: formData.due_date ? formData.due_date.toISOString() : null
    });
    setFormData({ title: '', description: '', due_date: null });
  };

  const setQuickDate = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    setFormData({ ...formData, due_date: date });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="bg-white rounded-lg p-6 w-full max-w-md mx-auto mt-20 shadow-xl"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center"
    >
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          {todo ? 'Edit Todo' : 'Add New Todo'}
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <div className="flex space-x-2 mb-2">
              <button
                type="button"
                onClick={() => setQuickDate(0)}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setQuickDate(1)}
                className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, due_date: null })}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Clear
              </button>
            </div>
            <DatePicker
              selected={formData.due_date}
              onChange={(date) => setFormData({ ...formData, due_date: date })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholderText="Select a date"
            />
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            type="submit"
            className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {todo ? 'Update' : 'Add'} Todo
          </button>
          <button
            type="button"
            onClick={onRequestClose}
            className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TodoModal;