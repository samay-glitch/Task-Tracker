import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableTaskItem = ({ task, onEdit, onDelete, onStatusChange, theme }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        opacity: isDragging ? 0.5 : 1,
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'bg-red-500/20 text-red-300 border-red-500/50';
            case 'medium':
                return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
            case 'low':
                return 'bg-green-500/20 text-green-300 border-green-500/50';
            default:
                return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-500/20 text-green-300 border-green-500/50';
            case 'in-progress':
                return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
            case 'pending':
                return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
            default:
                return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
        }
    };

    const formatDate = (date) => {
        if (!date) return 'No due date';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`backdrop-blur-lg rounded-xl p-6 shadow-xl border transition-all duration-300 ${theme === 'dark'
                    ? 'bg-white/10 border-white/20 hover:border-purple-500/50'
                    : 'bg-white/90 border-purple-100 hover:border-purple-300'
                } ${isDragging ? 'shadow-2xl ring-2 ring-purple-500' : ''}`}
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1 flex gap-3">
                    <div
                        {...attributes}
                        {...listeners}
                        className={`mt-1 cursor-grab active:cursor-grabbing transition ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-purple-600'
                            }`}
                        title="Drag to reorder"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                        </svg>
                    </div>
                    <div>
                        <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{task.title}</h3>
                        {task.description && (
                            <p className={theme === 'dark' ? 'text-gray-300 mb-3' : 'text-slate-600 mb-3'}>{task.description}</p>
                        )}
                    </div>
                </div>
                <div className="flex gap-2 ml-4">
                    <button
                        onClick={() => onEdit(task)}
                        className="p-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all duration-200"
                        title="Edit task"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => onDelete(task._id)}
                        className="p-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all duration-200"
                        title="Delete task"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-3 ml-9">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(task.status)}`}>
                    {task.status.replace('-', ' ').toUpperCase()}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(task.priority)}`}>
                    {task.priority.toUpperCase()} PRIORITY
                </span>
                {task.dueDate && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/50">
                        📅 {formatDate(task.dueDate)}
                    </span>
                )}
            </div>

            {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3 ml-9">
                    {task.tags.map((tag, index) => (
                        <span
                            key={index}
                            className={`px-2 py-1 rounded text-xs border ${theme === 'dark'
                                    ? 'bg-white/5 text-gray-300 border-white/10'
                                    : 'bg-slate-100 text-slate-600 border-slate-200'
                                }`}
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            <div className={`flex gap-2 pt-3 border-t ml-9 ${theme === 'dark' ? 'border-white/10' : 'border-slate-100'}`}>
                {['pending', 'in-progress', 'completed'].map((status) => (
                    <button
                        key={status}
                        onClick={() => onStatusChange(task._id, status)}
                        disabled={task.status === status}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all duration-200 ${task.status === status
                                ? (theme === 'dark' ? 'bg-purple-500/30 text-purple-200 cursor-not-allowed border border-purple-500/30' : 'bg-purple-100 text-purple-700 cursor-not-allowed border border-purple-200')
                                : (theme === 'dark' ? 'bg-white/5 text-gray-300 hover:bg-white/10' : 'bg-slate-50 text-slate-500 hover:bg-slate-100')
                            }`}
                    >
                        {status.replace('-', ' ').charAt(0).toUpperCase() + status.replace('-', ' ').slice(1)}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SortableTaskItem;
