import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableTaskItem from './SortableTaskItem';

const TaskList = ({ tasks, onEdit, onDelete, onStatusChange, theme }) => {
  if (tasks.length === 0) {
    return (
      <div className={`${theme === 'dark' ? 'bg-white/10' : 'bg-white/80'} backdrop-blur-lg rounded-2xl p-12 shadow-2xl border ${theme === 'dark' ? 'border-white/20' : 'border-purple-100'} text-center`}>
        <div className="text-6xl mb-4">📋</div>
        <h3 className={`text-2xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>No tasks yet</h3>
        <p className={theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}>Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Your Tasks ({tasks.length})</h2>
      <SortableContext
        items={tasks.map((t) => t._id)}
        strategy={verticalListSortingStrategy}
      >
        {tasks.map((task) => (
          <SortableTaskItem
            key={task._id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
            theme={theme}
          />
        ))}
      </SortableContext>
    </div>
  );
};

export default TaskList;
