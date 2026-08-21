import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, Filter, ArrowUpDown, LayoutGrid, List, CheckCircle2, Clock, AlertTriangle, Sparkles, Inbox } from 'lucide-react';
import { Category, PriorityLevel, Task } from '../../types';
import { CATEGORY_COLORS, PRIORITY_THEMES, isOverdue, refreshTask } from '../../utils/priorityEngine';
import { TaskCard } from '../TaskCard';
import { sounds } from '../../utils/soundEffects';

interface TasksViewProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onStartFocus: (task: Task) => void;
  onOpenAddModal: () => void;
}

const CATEGORIES: ('All' | Category)[] = [
  'All',
  'Education',
  'Work',
  'Personal',
  'Health',
  'Finance',
  'Home',
  'Creative',
  'Tech',
  'Errands',
];

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  onStartFocus,
  onOpenAddModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'overdue'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | PriorityLevel>('all');
  const [selectedCategory, setSelectedCategory] = useState<'All' | Category>('All');
  const [sortBy, setSortBy] = useState<'priority' | 'deadline' | 'importance' | 'difficulty' | 'time'>('priority');
  const [viewMode, setViewMode] = useState<'cards' | 'compact'>('cards');

  // Filter & Sort Logic
  const filtered = tasks
    .map(refreshTask)
    .filter((task) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(q);
        const matchDesc = (task.description || '').toLowerCase().includes(q);
        const matchCat = task.category.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchCat) return false;
      }

      // Status
      if (statusFilter === 'active' && task.completed) return false;
      if (statusFilter === 'completed' && !task.completed) return false;
      if (statusFilter === 'overdue' && !isOverdue(task)) return false;

      // Priority
      if (priorityFilter !== 'all' && task.priorityLevel !== priorityFilter) return false;

      // Category
      if (selectedCategory !== 'All' && task.category !== selectedCategory) return false;

      return true;
    })
    .sort((a, b) => {
      // Completed items always at bottom unless filtering completed
      if (statusFilter !== 'completed' && a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      if (sortBy === 'priority') {
        return b.priorityScore - a.priorityScore;
      }
      if (sortBy === 'deadline') {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      if (sortBy === 'importance') {
        return b.importance - a.importance;
      }
      if (sortBy === 'difficulty') {
        return b.difficulty - a.difficulty;
      }
      if (sortBy === 'time') {
        return b.estimatedTime - a.estimatedTime;
      }
      return 0;
    });

  const activeCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const overdueCount = tasks.filter(isOverdue).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[9px] uppercase tracking-[0.25em] font-bold text-rose-500">
            STRATEGIC INVENTORY
          </div>
          <h1 className="text-2xl sm:text-3xl font-light italic font-editorial-serif tracking-tight text-neutral-900 dark:text-white flex items-center gap-3">
            <span>Prioritized Catalog</span>
            <span className="text-[10px] uppercase font-mono font-bold bg-neutral-100 dark:bg-white/10 text-neutral-700 dark:text-neutral-300 px-2.5 py-1 rounded">
              {filtered.length} ITEMS
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Real-time algorithmic queue ranked by urgency, importance, and execution weight.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center p-1 bg-neutral-100 dark:bg-white/[0.06] rounded-xl border border-neutral-200 dark:border-white/10">
            <button
              onClick={() => {
                sounds.playPop();
                setViewMode('cards');
              }}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'cards'
                  ? 'bg-white dark:bg-[#090A0F] text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
              }`}
              title="Cards view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                sounds.playPop();
                setViewMode('compact');
              }}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'compact'
                  ? 'bg-white dark:bg-[#090A0F] text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
              }`}
              title="Compact list view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              sounds.playWhoosh();
              onOpenAddModal();
            }}
            className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Task</span>
          </motion.button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white/90 dark:bg-[#0D0E14]/90 border border-neutral-200/80 dark:border-white/10 shadow-sm space-y-4">
        {/* Row 1: Search & Status Tabs */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, description, or category..."
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/10 focus:ring-2 focus:ring-rose-500 focus:outline-none text-neutral-900 dark:text-white font-medium placeholder:text-neutral-400"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center overflow-x-auto pb-1 lg:pb-0 gap-1.5 p-1 bg-neutral-100 dark:bg-white/[0.05] rounded-xl">
            {[
              { id: 'all', label: 'All Tasks', count: tasks.length },
              { id: 'active', label: 'Active', count: activeCount },
              { id: 'overdue', label: 'Overdue', count: overdueCount, alert: overdueCount > 0 },
              { id: 'completed', label: 'Completed', count: completedCount },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  sounds.playPop();
                  setStatusFilter(tab.id as any);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  statusFilter === tab.id
                    ? 'bg-white dark:bg-[#090A0F] text-neutral-900 dark:text-white shadow-sm'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                    tab.alert
                      ? 'bg-rose-500 text-white animate-pulse'
                      : statusFilter === tab.id
                      ? 'bg-neutral-200 dark:bg-white/20 text-neutral-900 dark:text-white'
                      : 'bg-neutral-200/70 dark:bg-white/10 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Priority Level Chips + Category Filter + Sort Dropdown */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-100 dark:border-white/10">
          {/* Priority Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mr-1 font-mono">
              LEVEL:
            </span>
            <button
              onClick={() => {
                sounds.playPop();
                setPriorityFilter('all');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider font-mono transition-all ${
                priorityFilter === 'all'
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-black font-bold'
                  : 'bg-neutral-100 dark:bg-white/[0.05] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-white/10'
              }`}
            >
              All
            </button>
            {(['critical', 'high', 'medium', 'low'] as PriorityLevel[]).map((p) => {
              const theme = PRIORITY_THEMES[p];
              return (
                <button
                  key={p}
                  onClick={() => {
                    sounds.playPop();
                    setPriorityFilter(p);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider font-mono transition-all flex items-center gap-1 border ${
                    priorityFilter === p
                      ? `${theme.bgSoft} ring-1 ring-rose-500/50 font-bold`
                      : 'bg-neutral-100 dark:bg-white/[0.04] border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                  }`}
                >
                  <span>{theme.flameEmoji}</span>
                  <span>{theme.badge}</span>
                </button>
              );
            })}
          </div>

          {/* Category & Sort controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Category Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                CAT:
              </span>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  sounds.playPop();
                  setSelectedCategory(e.target.value as any);
                }}
                className="text-xs px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-white/[0.06] text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-white/10 font-medium focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-white dark:bg-[#0D0E14] text-neutral-900 dark:text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
              <select
                value={sortBy}
                onChange={(e) => {
                  sounds.playPop();
                  setSortBy(e.target.value as any);
                }}
                className="text-xs px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-white/[0.06] text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-white/10 font-medium focus:outline-none"
              >
                <option value="priority" className="bg-white dark:bg-[#0D0E14] text-neutral-900 dark:text-white">Sort: Highest Priority</option>
                <option value="deadline" className="bg-white dark:bg-[#0D0E14] text-neutral-900 dark:text-white">Sort: Earliest Deadline</option>
                <option value="importance" className="bg-white dark:bg-[#0D0E14] text-neutral-900 dark:text-white">Sort: Highest Importance</option>
                <option value="difficulty" className="bg-white dark:bg-[#0D0E14] text-neutral-900 dark:text-white">Sort: Complexity</option>
                <option value="time" className="bg-white dark:bg-[#0D0E14] text-neutral-900 dark:text-white">Sort: Allocated Hours</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Task List Items with Animated Presence */}
      {filtered.length > 0 ? (
        <div className={viewMode === 'cards' ? 'space-y-3' : 'space-y-2'}>
          <AnimatePresence mode="popLayout">
            {filtered.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={onToggleTask}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onStartFocus={onStartFocus}
                compact={viewMode === 'compact'}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-12 rounded-2xl bg-white/90 dark:bg-[#0D0E14]/90 border border-neutral-200/80 dark:border-white/10 text-center space-y-3"
        >
          <div className="w-14 h-14 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
            <Inbox className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-neutral-900 dark:text-white">
            No matching tasks found
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto font-light">
            {searchQuery || priorityFilter !== 'all' || selectedCategory !== 'All' || statusFilter !== 'all'
              ? 'Try adjusting your search queries or priority filters.'
              : 'Add your first task to see the priority engine in action!'}
          </p>
          <button
            onClick={onOpenAddModal}
            className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black text-xs font-black uppercase tracking-wider shadow-md hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all"
          >
            + Create Task
          </button>
        </motion.div>
      )}
    </div>
  );
};
