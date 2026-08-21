import React from 'react';
import { motion } from 'motion/react';
import { Flame, Calendar, Users, Trash2, Plus, Play, CheckCircle2, AlertCircle } from 'lucide-react';
import { Task } from '../../types';
import { categorizeEisenhower, formatDeadlineText } from '../../utils/priorityEngine';
import { AnimatedPriorityDial } from '../AnimatedPriorityDial';
import { sounds } from '../../utils/soundEffects';

interface MatrixViewProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onStartFocus: (task: Task) => void;
  onOpenAddModal: () => void;
}

export const MatrixView: React.FC<MatrixViewProps> = ({
  tasks,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  onStartFocus,
  onOpenAddModal,
}) => {
  const quadrants = categorizeEisenhower(tasks);

  const quadrantConfig = [
    {
      id: 'doFirst',
      title: 'QUADRANT I: DO FIRST',
      sub: 'Urgent & Important (Crises, Impending Deadlines)',
      color: 'border-rose-500/30 bg-rose-500/5 dark:bg-rose-950/20',
      badgeColor: 'bg-rose-500 text-white',
      icon: Flame,
      iconColor: 'text-rose-500',
      tasks: quadrants.doFirst,
      guide: 'Tackle immediately. High impact and impending deadlines.',
    },
    {
      id: 'schedule',
      title: 'QUADRANT II: SCHEDULE',
      sub: 'Not Urgent & Important (Growth, Strategy, Deep Work)',
      color: 'border-indigo-500/30 bg-indigo-500/5 dark:bg-indigo-950/20',
      badgeColor: 'bg-indigo-600 text-white',
      icon: Calendar,
      iconColor: 'text-indigo-500',
      tasks: quadrants.schedule,
      guide: 'Schedule dedicated focus blocks. These produce the highest long-term leverage.',
    },
    {
      id: 'delegate',
      title: 'QUADRANT III: DELEGATE',
      sub: 'Urgent & Not Important (Interrupts, Quick Chores)',
      color: 'border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20',
      badgeColor: 'bg-amber-500 text-black',
      icon: Users,
      iconColor: 'text-amber-500',
      tasks: quadrants.delegate,
      guide: 'Batch, automate, or execute rapidly in small time pockets.',
    },
    {
      id: 'eliminate',
      title: 'QUADRANT IV: ELIMINATE',
      sub: 'Not Urgent & Not Important (Low Impact, Distractions)',
      color: 'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20',
      badgeColor: 'bg-emerald-600 text-white',
      icon: Trash2,
      iconColor: 'text-emerald-500',
      tasks: quadrants.eliminate,
      guide: 'Safely postpone or eliminate without harming key goals.',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[9px] uppercase tracking-[0.25em] font-bold text-rose-500">
            STRATEGIC MATRIX
          </div>
          <h1 className="text-2xl sm:text-3xl font-light italic font-editorial-serif tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
            <span>Eisenhower Decision Quadrants</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            2×2 strategic framework balancing urgency against compounding value.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            sounds.playWhoosh();
            onOpenAddModal();
          }}
          className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 self-start transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Task</span>
        </motion.button>
      </div>

      {/* 2x2 Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {quadrantConfig.map((q) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl border ${q.color} bg-white/90 dark:bg-[#0D0E14]/90 p-5 sm:p-6 flex flex-col justify-between shadow-sm min-h-[340px]`}
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2 pb-3 mb-3 border-b border-neutral-200/80 dark:border-white/10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <q.icon className={`w-4 h-4 ${q.iconColor}`} />
                    <h3 className="font-extrabold text-xs sm:text-sm uppercase tracking-wider font-mono text-neutral-900 dark:text-white">
                      {q.title}
                    </h3>
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    {q.sub}
                  </p>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${q.badgeColor}`}>
                  {q.tasks.length}
                </span>
              </div>

              {/* Task Items */}
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {q.tasks.map((task) => {
                  const deadlineInfo = formatDeadlineText(task.deadline);
                  return (
                    <motion.div
                      key={task.id}
                      whileHover={{ scale: 1.01 }}
                      className="p-3.5 rounded-xl bg-neutral-50/80 dark:bg-[#090A0F]/80 border border-neutral-200/80 dark:border-white/10 shadow-sm flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <AnimatedPriorityDial
                          score={task.priorityScore}
                          size="xs"
                          interactive={false}
                        />
                        <div className="min-w-0">
                          <h4 className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-white truncate">
                            {task.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono mt-0.5">
                            <span className={deadlineInfo.isUrgent ? 'text-rose-500 font-bold' : ''}>
                              {deadlineInfo.text}
                            </span>
                            <span>•</span>
                            <span>{task.category}</span>
                            <span>•</span>
                            <span>{task.estimatedTime}h</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            sounds.playWhoosh();
                            onStartFocus(task);
                          }}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10"
                          title="Start Focus"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </button>
                        <button
                          onClick={() => onToggleTask(task.id)}
                          className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-500/10"
                          title="Mark Done"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}

                {q.tasks.length === 0 && (
                  <div className="py-8 text-center text-xs text-neutral-400 font-editorial-serif italic">
                    Quadrant is currently clear.
                  </div>
                )}
              </div>
            </div>

            {/* Strategic Guide Tip */}
            <div className="mt-4 pt-3 border-t border-neutral-200/50 dark:border-white/10 text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center justify-between font-light">
              <span>✦ {q.guide}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
