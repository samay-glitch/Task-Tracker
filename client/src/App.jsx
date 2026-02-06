import { useState, useEffect, useMemo } from 'react';
import { taskService } from './services/taskService';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import FilterBar from './components/FilterBar';
import Login from './components/Login';
import Signup from './components/Signup';
import { useAuth } from './context/AuthContext';
import { toast } from 'react-hot-toast';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

function App() {
  const { user, logout, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ search: '', status: 'all', priority: 'all' });
  const [isLoginView, setIsLoginView] = useState(true);
  const [theme, setTheme] = useState('dark');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getAllTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks. Make sure the backend is running.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks([newTask, ...tasks]);
      toast.success('Task created successfully!');
    } catch (err) {
      setError('Failed to create task');
      toast.error('Failed to create task');
      console.error('Error creating task:', err);
    }
  };

  const handleUpdateTask = async (id, taskData) => {
    try {
      const updatedTask = await taskService.updateTask(id, taskData);
      setTasks(tasks.map(task => task._id === id ? updatedTask : task));
      setEditingTask(null);
      toast.success('Task updated successfully!');
    } catch (err) {
      setError('Failed to update task');
      toast.error('Failed to update task');
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskService.deleteTask(id);
      setTasks(tasks.filter(task => task._id !== id));
      toast.success('Task deleted successfully!');
    } catch (err) {
      setError('Failed to delete task');
      toast.error('Failed to delete task');
      console.error('Error deleting task:', err);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex((item) => item._id === active.id);
        const newIndex = items.findIndex((item) => item._id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        // Prepare reorder data for backend
        const reorderData = newItems.map((item, index) => ({
          _id: item._id,
          order: index,
        }));

        // Sync with backend (fire and forget locally)
        taskService.reorderTasks(reorderData).catch(err => {
          toast.error('Failed to save task order');
          console.error('Reorder error:', err);
        });

        return newItems;
      });
    }
  };

  const stats = useMemo(() => {
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'completed').length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus = filters.status === 'all' || task.status === filters.status;
      const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, filters]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
        {isLoginView ? (
          <Login onSwitch={() => setIsLoginView(false)} />
        ) : (
          <Signup onSwitch={() => setIsLoginView(true)} />
        )}
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${theme === 'dark'
      ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'
      : 'bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100'
      }`}>
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="text-left flex items-center gap-4">
            <div>
              <h1 className={`text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600`}>
                Task Tracker
              </h1>
              <p className={theme === 'dark' ? 'text-gray-300 text-lg' : 'text-gray-600 text-lg'}>
                Welcome back, {user.name}!
              </p>
            </div>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-3 rounded-full transition-all ${theme === 'dark' ? 'bg-white/10 text-yellow-400' : 'bg-slate-200 text-purple-600'
                } hover:scale-110 shadow-lg`}
              title="Toggle Theme"
            >
              {theme === 'dark' ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
              )}
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <div className={`${theme === 'dark' ? 'bg-white/5' : 'bg-white/80'} backdrop-blur-md px-4 py-2 rounded-xl border ${theme === 'dark' ? 'border-white/10' : 'border-purple-100'} text-center shadow-sm`}>
              <span className={`block text-xs uppercase font-bold text-center ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Total</span>
              <span className={`text-xl font-bold text-center ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{stats.total}</span>
            </div>
            <div className={`${theme === 'dark' ? 'bg-green-500/10' : 'bg-green-50'} backdrop-blur-md px-4 py-2 rounded-xl border ${theme === 'dark' ? 'border-green-500/20' : 'border-green-100'} text-center shadow-sm`}>
              <span className="block text-xs text-green-500 uppercase font-bold text-center">Done</span>
              <span className={`text-xl font-bold text-center ${theme === 'dark' ? 'text-green-300' : 'text-green-600'}`}>{stats.completed}</span>
            </div>
            <div className={`${theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'} backdrop-blur-md px-4 py-2 rounded-xl border ${theme === 'dark' ? 'border-blue-500/20' : 'border-blue-100'} text-center shadow-sm`}>
              <span className="block text-xs text-blue-500 uppercase font-bold text-center">Doing</span>
              <span className={`text-xl font-bold text-center ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>{stats.inProgress}</span>
            </div>
            <div className={`${theme === 'dark' ? 'bg-gray-500/10' : 'bg-slate-50'} backdrop-blur-md px-4 py-2 rounded-xl border ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'} text-center shadow-sm`}>
              <span className={`block text-xs uppercase font-bold text-center ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Todo</span>
              <span className={`text-xl font-bold text-center ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>{stats.pending}</span>
            </div>
          </div>

          <button
            onClick={logout}
            className={`px-6 py-2 rounded-lg transition-all font-semibold shadow-lg ${theme === 'dark'
                ? 'bg-red-500/20 text-red-300 border border-red-500/50 hover:bg-red-500/30 hover:shadow-red-500/20'
                : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:shadow-red-200/50'
              }`}
          >
            Logout
          </button>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-center">
            {error}
          </div>
        )}

        <FilterBar onFilterChange={setFilters} theme={theme} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <TaskForm
              onSubmit={editingTask ? (data) => handleUpdateTask(editingTask._id, data) : handleCreateTask}
              initialData={editingTask}
              onCancel={() => setEditingTask(null)}
              theme={theme}
            />
          </div>

          <div className="lg:col-span-2">
            {loading ? (
              <div className="text-center text-white text-xl py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                <p className="mt-4">Loading tasks...</p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
              >
                <TaskList
                  tasks={filteredTasks}
                  onEdit={setEditingTask}
                  onDelete={handleDeleteTask}
                  onStatusChange={(id, status) => handleUpdateTask(id, { status })}
                  theme={theme}
                />
              </DndContext>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
