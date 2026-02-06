import { useState, useEffect } from 'react';

const TaskForm = ({ onSubmit, initialData, onCancel, theme }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        dueDate: '',
        tags: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                status: initialData.status || 'pending',
                priority: initialData.priority || 'medium',
                dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
                tags: initialData.tags ? initialData.tags.join(', ') : '',
            });
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const taskData = {
            ...formData,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            dueDate: formData.dueDate || undefined,
        };
        onSubmit(taskData);
        if (!initialData) {
            setFormData({
                title: '',
                description: '',
                status: 'pending',
                priority: 'medium',
                dueDate: '',
                tags: '',
            });
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className={`${theme === 'dark' ? 'bg-white/10' : 'bg-white/80'} backdrop-blur-lg rounded-2xl p-6 shadow-2xl border ${theme === 'dark' ? 'border-white/20' : 'border-purple-100'}`}>
            <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                {initialData ? 'Edit Task' : 'Create New Task'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-slate-600'}`}>
                        Title *
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${theme === 'dark'
                                ? 'bg-white/5 border border-white/20 text-white placeholder-gray-400'
                                : 'bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400'
                            }`}
                        placeholder="Enter task title"
                    />
                </div>

                <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-slate-600'}`}>
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        className={`w-full px-4 py-2 rounded-lg transition resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${theme === 'dark'
                                ? 'bg-white/5 border border-white/20 text-white placeholder-gray-400'
                                : 'bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400'
                            }`}
                        placeholder="Enter task description"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-slate-600'}`}>
                            Status
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${theme === 'dark'
                                    ? 'bg-white/5 border border-white/20 text-white'
                                    : 'bg-slate-100 border border-slate-200 text-slate-900'
                                }`}
                        >
                            <option value="pending" className={theme === 'dark' ? 'bg-slate-800' : 'bg-white'}>Pending</option>
                            <option value="in-progress" className={theme === 'dark' ? 'bg-slate-800' : 'bg-white'}>In Progress</option>
                            <option value="completed" className={theme === 'dark' ? 'bg-slate-800' : 'bg-white'}>Completed</option>
                        </select>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-slate-600'}`}>
                            Priority
                        </label>
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${theme === 'dark'
                                    ? 'bg-white/5 border border-white/20 text-white'
                                    : 'bg-slate-100 border border-slate-200 text-slate-900'
                                }`}
                        >
                            <option value="low" className={theme === 'dark' ? 'bg-slate-800' : 'bg-white'}>Low</option>
                            <option value="medium" className={theme === 'dark' ? 'bg-slate-800' : 'bg-white'}>Medium</option>
                            <option value="high" className={theme === 'dark' ? 'bg-slate-800' : 'bg-white'}>High</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-slate-600'}`}>
                        Due Date
                    </label>
                    <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${theme === 'dark'
                                ? 'bg-white/5 border border-white/20 text-white'
                                : 'bg-slate-100 border border-slate-200 text-slate-900'
                            }`}
                    />
                </div>

                <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-slate-600'}`}>
                        Tags (comma separated)
                    </label>
                    <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${theme === 'dark'
                                ? 'bg-white/5 border border-white/20 text-white placeholder-gray-400'
                                : 'bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400'
                            }`}
                        placeholder="e.g., urgent, frontend, bug"
                    />
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-purple-500/50"
                    >
                        {initialData ? 'Update Task' : 'Create Task'}
                    </button>
                    {initialData && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className={`px-6 py-2 font-semibold rounded-lg transition-all duration-200 ${theme === 'dark' ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                                }`}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default TaskForm;
