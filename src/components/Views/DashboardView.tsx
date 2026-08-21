import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Flame, CheckCircle, Clock, AlertOctagon, TrendingUp, Layers, Play, ArrowRight, Compass } from 'lucide-react';
import { Task, User } from '../../types';
import { PRIORITY_THEMES, categorizeEisenhower, formatDeadlineText, getSmartRecommendations, isOverdue, refreshTask } from '../../utils/priorityEngine';
import { AnimatedPriorityDial } from '../AnimatedPriorityDial';
import { AnimatedCharts } from '../AnimatedCharts';
import { sounds } from '../../utils/soundEffects';

interface DashboardViewProps {
  user: User;
  tasks: Task[];
  onOpenAddModal: () => void;
  onStartFocus: (task: Task) => void;
  onNavigateTab: (tab: string) => void;
  onToggleTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  tasks,
  onOpenAddModal,
  onStartFocus,
  onNavigateTab,
  onToggleTask,
  onEditTask,
}) => {
  const refreshed = tasks.map(refreshTask);
  const total = refreshed.length;
  const completed = refreshed.filter((t) => t.completed).length;
  const pending = total - completed;
  const overdueTasks = refreshed.filter(isOverdue);
  const criticalTasks = refreshed.filter((t) => !t.completed && t.priorityLevel === 'critical');
  const highTasks = refreshed.filter((t) => !t.completed && t.priorityLevel === 'high');
  const productivity = total > 0 ? Math.round((completed / total) * 100) : 0;

  const smartRecs = getSmartRecommendations(tasks);
  const focusTrio = smartRecs.focusTrio;
  const eisenhower = categorizeEisenhower(tasks);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Editorial Hero Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-6 sm:p-10 bg-white/90 dark:bg-[#0D0E14]/95 text-neutral-900 dark:text-white border border-neutral-200 dark:border-white/15 shadow-2xl backdrop-blur-xl"
      >
        {/* Ambient floating glowing light orbs */}
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-16 right-40 w-72 h-72 bg-rose-600/15 rounded-full blur-[110px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-rose-500">
                DAILY INTELLIGENCE BRIEF
              </span>
              <span className="text-neutral-300 dark:text-white/20">|</span>
              <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-neutral-400 dark:text-white/40">
                DISPATCH #402
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-light italic font-editorial-serif tracking-tight text-neutral-900 dark:text-white">
              Hyper <span className="font-editorial-display font-black not-italic tracking-tighter uppercase bg-gradient-to-r from-rose-500 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">Priority</span>
            </h1>

            <p className="text-sm sm:text-base text-neutral-600 dark:text-white/70 leading-relaxed font-light border-l-2 border-rose-500/60 pl-4 py-0.5">
              {overdueTasks.length > 0
                ? `Immediate strategic intervention required: ${overdueTasks.length} overdue goal${overdueTasks.length > 1 ? 's' : ''} have breached deadline parameters.`
                : pending > 0
                ? `You have ${pending} prioritized tasks queued. Focus execution on your top weighted objectives below.`
                : 'Workspace synchronized. All tactical queues are fulfilled and ready for strategic initiatives.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                sounds.playWhoosh();
                onOpenAddModal();
              }}
              className="px-6 py-3.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-neutral-800 dark:hover:bg-neutral-100 flex items-center gap-2 transition-all"
            >
              <span>+ Add Task</span>
            </motion.button>

            {focusTrio[0] && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  sounds.playWhoosh();
                  onStartFocus(focusTrio[0]);
                }}
                className="px-5 py-3.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-white/10 dark:hover:bg-white/20 border border-neutral-300 dark:border-white/20 text-neutral-900 dark:text-white font-bold text-xs uppercase tracking-wider backdrop-blur-sm flex items-center gap-2 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current text-rose-500" />
                <span>Enter Focus</span>
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Quick Metrics Bar with Editorial Styling */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {[
          {
            tag: 'VOLUME',
            label: 'Total Tasks',
            value: total,
            icon: Layers,
            color: 'text-indigo-500',
            bg: 'bg-indigo-500/10 dark:bg-indigo-500/15',
            sub: `${completed} completed`,
          },
          {
            tag: 'VELOCITY',
            label: 'Productivity',
            value: `${productivity}%`,
            icon: TrendingUp,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
            sub: 'Completion rate',
          },
          {
            tag: 'URGENCY',
            label: 'High & Critical',
            value: criticalTasks.length + highTasks.length,
            icon: Flame,
            color: 'text-rose-500',
            bg: 'bg-rose-500/10 dark:bg-rose-500/15',
            sub: `${criticalTasks.length} critical items`,
          },
          {
            tag: 'VARIANCE',
            label: 'Overdue Items',
            value: overdueTasks.length,
            icon: AlertOctagon,
            color: overdueTasks.length > 0 ? 'text-rose-500 animate-pulse' : 'text-neutral-400',
            bg: overdueTasks.length > 0 ? 'bg-rose-500/15' : 'bg-neutral-100 dark:bg-white/5',
            sub: overdueTasks.length > 0 ? 'Action required' : 'Deadlines clear',
          },
        ].map((metric, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -3 }}
            className="p-5 sm:p-6 rounded-2xl bg-white/90 dark:bg-[#0D0E14]/90 border border-neutral-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[9px] uppercase tracking-[0.25em] font-mono font-bold text-neutral-400 dark:text-neutral-500">
                {metric.tag}
              </span>
              <div className={`p-2 rounded-lg ${metric.bg} ${metric.color}`}>
                <metric.icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl font-black font-mono tracking-tight text-neutral-900 dark:text-white">
                {metric.value}
              </div>
              <div className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 mt-1">
                {metric.label}
              </div>
              <div className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5 font-mono">
                {metric.sub}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Focus Trio Section (The 3 tasks that matter most) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-[0.25em] font-bold text-rose-500">
                STRATEGIC FOCUS
              </div>
              <h2 className="text-lg sm:text-xl font-light italic font-editorial-serif text-neutral-900 dark:text-white">
                Priority Trio
              </h2>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('focus')}
            className="text-xs font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400 hover:underline flex items-center gap-1 font-mono"
          >
            <span>Launch Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {focusTrio.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {focusTrio.map((task, idx) => {
              const theme = PRIORITY_THEMES[task.priorityLevel];
              const deadline = formatDeadlineText(task.deadline);
              const isFirst = idx === 0;

              return (
                <motion.div
                  key={task.id}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className={`relative rounded-2xl p-6 flex flex-col justify-between overflow-hidden transition-all border ${
                    isFirst
                      ? 'bg-white/95 dark:bg-[#0F1018]/95 border-rose-500/40 dark:border-rose-500/30 shadow-xl ring-1 ring-rose-500/20'
                      : 'bg-white/90 dark:bg-[#0D0E14]/90 border-neutral-200/80 dark:border-white/10 shadow-sm'
                  }`}
                >
                  {isFirst && (
                    <div className="absolute top-0 right-0 px-3 py-1 bg-rose-500 text-white text-[9px] font-mono font-black uppercase tracking-widest rounded-bl-xl">
                      RANK #1
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-neutral-100 dark:bg-white/10 text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                        Slot #{idx + 1}
                      </span>
                      <AnimatedPriorityDial
                        score={task.priorityScore}
                        size="sm"
                        taskData={{
                          deadline: task.deadline,
                          importance: task.importance,
                          difficulty: task.difficulty,
                          estimatedTime: task.estimatedTime,
                        }}
                      />
                    </div>

                    <h3 className="font-bold text-base text-neutral-900 dark:text-white line-clamp-2 mb-2">
                      {task.title}
                    </h3>

                    {task.description && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-3 font-light">
                        {task.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-neutral-100 dark:border-white/10 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span
                        className={`font-medium flex items-center gap-1 font-mono text-[11px] ${
                          deadline.isUrgent ? 'text-rose-500 font-bold' : 'text-neutral-500 dark:text-neutral-400'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        {deadline.text}
                      </span>
                      <span className="text-neutral-400 dark:text-neutral-500 font-mono text-[11px]">
                        ~{task.estimatedTime}h
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => {
                          sounds.playWhoosh();
                          onStartFocus(task);
                        }}
                        className="flex-1 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-100 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <Play className="w-3 h-3 fill-current text-rose-500" />
                        <span>Focus 25m</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onToggleTask(task.id)}
                        className="p-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-500 border border-emerald-500/30"
                        title="Mark Completed"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-white/60 dark:bg-white/[0.02] border border-dashed border-neutral-300 dark:border-white/10 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-neutral-900 dark:text-white">
              No Pending Priority Tasks
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Add your upcoming assignments, exams, or projects to receive real-time priority scores.
            </p>
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black text-xs font-bold uppercase tracking-wider shadow-md"
            >
              + Add First Task
            </button>
          </div>
        )}
      </div>

      {/* Visual Analytics Charts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[9px] uppercase tracking-[0.25em] font-bold text-indigo-500">
              DATA VISUALIZATION
            </div>
            <h2 className="text-lg sm:text-xl font-light italic font-editorial-serif text-neutral-900 dark:text-white">
              Workload & Priority Distribution
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('analytics')}
            className="text-xs font-bold uppercase tracking-wider text-indigo-500 hover:underline flex items-center gap-1 font-mono"
          >
            <span>Full Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <AnimatedCharts tasks={tasks} />
      </div>

      {/* Eisenhower Matrix Preview Card */}
      <motion.div
        whileHover={{ y: -2 }}
        className="p-6 sm:p-8 rounded-2xl bg-white/90 dark:bg-[#0D0E14]/90 border border-neutral-200/80 dark:border-white/10 shadow-sm space-y-5"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[9px] uppercase tracking-[0.25em] font-bold text-rose-500">
              STRATEGIC FRAMEWORK
            </div>
            <h2 className="text-lg sm:text-xl font-light italic font-editorial-serif text-neutral-900 dark:text-white flex items-center gap-2">
              <span>Eisenhower Decision Quadrants</span>
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('matrix')}
            className="px-3.5 py-1.5 rounded-xl bg-neutral-100 dark:bg-white/10 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors uppercase tracking-wider font-mono"
          >
            Open Matrix ↗
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Q1: Do First */}
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-rose-500 flex items-center gap-1 font-mono">
                <span>Q.I: DO FIRST</span>
                <span className="text-[10px] font-normal text-rose-400">(Urgent & Important)</span>
              </span>
              <span className="text-xs font-mono font-bold text-rose-500 bg-rose-500/20 px-2 py-0.5 rounded">
                {eisenhower.doFirst.length}
              </span>
            </div>
            <div className="space-y-1.5">
              {eisenhower.doFirst.slice(0, 2).map((t) => (
                <div
                  key={t.id}
                  className="p-2.5 rounded-lg bg-white/90 dark:bg-[#090A0F]/90 border border-rose-200/60 dark:border-rose-900/60 text-xs font-semibold flex items-center justify-between"
                >
                  <span className="truncate mr-2 text-neutral-900 dark:text-white">{t.title}</span>
                  <span className="font-mono text-[11px] text-rose-500 font-bold">{t.priorityScore}</span>
                </div>
              ))}
              {eisenhower.doFirst.length === 0 && (
                <div className="text-xs text-rose-400/80 italic py-2 text-center font-editorial-serif">
                  No critical emergencies queued.
                </div>
              )}
            </div>
          </div>

          {/* Q2: Schedule */}
          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-indigo-500 flex items-center gap-1 font-mono">
                <span>Q.II: SCHEDULE</span>
                <span className="text-[10px] font-normal text-indigo-400">(Important, Not Urgent)</span>
              </span>
              <span className="text-xs font-mono font-bold text-indigo-500 bg-indigo-500/20 px-2 py-0.5 rounded">
                {eisenhower.schedule.length}
              </span>
            </div>
            <div className="space-y-1.5">
              {eisenhower.schedule.slice(0, 2).map((t) => (
                <div
                  key={t.id}
                  className="p-2.5 rounded-lg bg-white/90 dark:bg-[#090A0F]/90 border border-indigo-200/60 dark:border-indigo-900/60 text-xs font-semibold flex items-center justify-between"
                >
                  <span className="truncate mr-2 text-neutral-900 dark:text-white">{t.title}</span>
                  <span className="font-mono text-[11px] text-indigo-500 font-bold">{t.priorityScore}</span>
                </div>
              ))}
              {eisenhower.schedule.length === 0 && (
                <div className="text-xs text-indigo-400/80 italic py-2 text-center font-editorial-serif">
                  No deep work tasks scheduled yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
