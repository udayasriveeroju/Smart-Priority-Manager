import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Check, Clock, Edit3, Trash2, Zap, AlertCircle, Play, Sparkles } from 'lucide-react';
import { Task } from '../types';
import { CATEGORY_COLORS, PRIORITY_THEMES, formatDeadlineText, isOverdue } from '../utils/priorityEngine';
import { AnimatedPriorityDial } from './AnimatedPriorityDial';
import { fireTaskConfetti } from '../utils/confetti';
import { sounds } from '../utils/soundEffects';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStartFocus?: (task: Task) => void;
  compact?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggle,
  onEdit,
  onDelete,
  onStartFocus,
  compact = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const overdue = isOverdue(task);
  const deadlineInfo = formatDeadlineText(task.deadline);
  const priorityTheme = PRIORITY_THEMES[task.priorityLevel];
  const catTheme = CATEGORY_COLORS[task.category] || CATEGORY_COLORS.Education;

  const handleToggle = () => {
    if (!task.completed) {
      sounds.playComplete();
      fireTaskConfetti(cardRef.current);
    } else {
      sounds.playPop();
    }
    onToggle(task.id);
  };

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94, y: -10 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative rounded-2xl transition-all duration-200 ${
        task.completed
          ? 'bg-neutral-100/60 dark:bg-white/[0.02] border border-neutral-200/50 dark:border-white/5 opacity-65'
          : `bg-white/90 dark:bg-[#0D0E14]/90 border border-neutral-200/90 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-neutral-400 dark:hover:border-white/25 hover:-translate-y-0.5 ${
              task.priorityLevel === 'critical' ? 'hover:border-rose-500/40 hover:shadow-rose-500/10' : ''
            }`
      } p-4 sm:p-5`}
    >
      {/* Top accent glow line for critical tasks */}
      {!task.completed && task.priorityLevel === 'critical' && (
        <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-rose-500/90 to-transparent rounded-full" />
      )}

      <div className="flex items-start sm:items-center gap-3.5 sm:gap-4">
        {/* Animated Checkbox */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.88 }}
          onClick={handleToggle}
          aria-label={task.completed ? 'Mark pending' : 'Mark complete'}
          className={`relative flex-shrink-0 w-7 h-7 mt-0.5 sm:mt-0 rounded-xl border-2 flex items-center justify-center transition-colors duration-200 ${
            task.completed
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/30'
              : 'border-neutral-300 dark:border-white/20 hover:border-rose-500 dark:hover:border-rose-400 bg-neutral-50 dark:bg-white/[0.04]'
          }`}
        >
          {task.completed && (
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            >
              <Check className="w-4 h-4 stroke-[3]" />
            </motion.div>
          )}
        </motion.button>

        {/* Priority Gauge Dial */}
        <div className="flex-shrink-0">
          <AnimatedPriorityDial
            score={task.priorityScore}
            size={compact ? 'xs' : 'sm'}
            interactive={true}
            taskData={{
              deadline: task.deadline,
              importance: task.importance,
              difficulty: task.difficulty,
              estimatedTime: task.estimatedTime,
            }}
          />
        </div>

        {/* Task Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3
              className={`font-semibold text-sm sm:text-base leading-snug break-words transition-all duration-200 ${
                task.completed
                  ? 'line-through text-neutral-400 dark:text-neutral-500'
                  : 'text-neutral-900 dark:text-white'
              }`}
            >
              {task.title}
            </h3>

            {/* Priority Badge */}
            <span
              className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-mono font-bold px-2 py-0.5 rounded border ${priorityTheme.bgSoft}`}
            >
              <span>{priorityTheme.flameEmoji}</span>
              <span>{priorityTheme.badge}</span>
            </span>

            {/* Category Chip */}
            <span
              className={`text-[10px] uppercase tracking-wider font-mono font-medium px-2 py-0.5 rounded border ${catTheme.bg} ${catTheme.text}`}
            >
              {task.category}
            </span>
          </div>

          {task.description && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 mb-2">
              {task.description}
            </p>
          )}

          {/* Meta metrics bar */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {/* Deadline */}
            <div
              className={`flex items-center gap-1 font-medium ${
                overdue
                  ? 'text-rose-500 dark:text-rose-400 font-bold animate-pulse'
                  : deadlineInfo.isUrgent
                  ? 'text-amber-600 dark:text-amber-400 font-semibold'
                  : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              {overdue ? <AlertCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
              <span>{deadlineInfo.text}</span>
            </div>

            {/* Time requirement */}
            <div className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>{task.estimatedTime}h allocated</span>
            </div>

            {/* Importance & Difficulty stars/meters */}
            <div className="hidden sm:flex items-center gap-2 font-mono text-[10px]">
              <span className="bg-neutral-100 dark:bg-white/10 px-1.5 py-0.5 rounded text-neutral-600 dark:text-neutral-300">
                IMP: {task.importance}/10
              </span>
              <span className="bg-neutral-100 dark:bg-white/10 px-1.5 py-0.5 rounded text-neutral-600 dark:text-neutral-300">
                DIF: {task.difficulty}/10
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 flex-shrink-0 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
          {onStartFocus && !task.completed && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                sounds.playWhoosh();
                onStartFocus(task);
              }}
              title="Start Pomodoro focus session"
              className="p-1.5 sm:p-2 rounded-xl text-rose-500 hover:text-white hover:bg-rose-500 bg-rose-500/10 transition-colors"
            >
              <Play className="w-4 h-4 fill-current" />
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              sounds.playPop();
              onEdit(task);
            }}
            title="Edit task"
            className="p-1.5 sm:p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              sounds.playPop();
              onDelete(task.id);
            }}
            title="Delete task"
            className="p-1.5 sm:p-2 rounded-xl text-neutral-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
