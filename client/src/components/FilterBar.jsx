import { useState } from 'react';

const FilterBar = ({ onFilterChange, theme }) => {
    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
        priority: 'all',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    return (
        <div className={`backdrop-blur-lg rounded-xl p-4 mb-6 border shadow-xl transition-all ${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/80 border-purple-100'
            }`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        name="search"
                        placeholder="Search tasks..."
                        value={filters.search}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-purple-500 ${theme === 'dark'
                                ? 'bg-white/5 border border-white/20 text-white placeholder-gray-400'
                                : 'bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400'
                            }`}
                    />
                </div>

                <div>
                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-purple-500 ${theme === 'dark'
                                ? 'bg-white/5 border border-white/20 text-white'
                                : 'bg-slate-100 border border-slate-200 text-slate-900'
                            }`}
                    >
                        <option value="all" className={theme === 'dark' ? 'bg-slate-800' : 'bg-white'}>All Statuses</option>
                        <option value="pending" className={theme === 'dark' ? 'bg-slate-800' : 'bg-white'}>Pending</option>
                        <option value="in-progress" className={theme === 'dark' ? 'bg-slate-800' : 'bg-white'}>In Progress</option>
                        <option value="completed" className={theme === 'dark' ? 'bg-slate-800' : 'bg-white'}>Completed</option>
                    </select>
                </div>

                <div>
                    <select
                        name="priority"
                        value={filters.priority}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-purple-500 ${theme === 'dark'
                                ? 'bg-white/5 border border-white/20 text-white'
                                : 'bg-slate-100 border border-slate-200 text-slate-900'
                            }`}
                    >
                        <option value="all" className={theme === 'dark' ? 'bg-slate-800' : 'bg-white'}>All Priorities</option>
                        <option value="low" className={theme === 'dark' ? 'bg-slate-800' : 'bg-white'}>Low</option>
                        <option value="medium" className={theme === 'dark' ? 'bg-slate-800' : 'bg-white'}>Medium</option>
                        <option value="high" className={theme === 'dark' ? 'bg-slate-800' : 'bg-white'}>High</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
