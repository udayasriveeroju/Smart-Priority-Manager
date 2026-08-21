import React from 'react';
import { motion } from 'motion/react';
import { BarChart3, TrendingUp, CheckCircle, Clock, Zap, Target, PieChart, Sparkles } from 'lucide-react';
import { Task } from '../../types';
import { CATEGORY_COLORS, PRIORITY_THEMES, refreshTask } from '../../utils/priorityEngine';
import { AnimatedCharts } from '../AnimatedCharts';

interface AnalyticsViewProps {
  tasks: Task[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ tasks }) => {
  const refreshed = tasks.map(refreshTask);
  const total = refreshed.length;
  const completed = refreshed.filter((t) => t.completed).length;
  const pending = total - completed;
  const productivity = total > 0 ? Math.round((completed / total) * 100) : 0;

  const avgImportance = total > 0 ? (refreshed.reduce((a, t) => a + t.importance, 0) / total).toFixed(1) : '0';
  const avgDifficulty = total > 0 ? (refreshed.reduce((a, t) => a + t.difficulty, 0) / total).toFixed(1) : '0';
  const totalEstimatedHours = refreshed.filter((t) => !t.completed).reduce((a, t) => a + t.estimatedTime, 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div>
        <div className="text-[9px] uppercase tracking-[0.25em] font-bold text-rose-500 font-mono">
          SYSTEM TELEMETRY
        </div>
        <h1 className="text-2xl sm:text-3xl font-light italic font-editorial-serif tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
          <span>Priority & Workload Analytics</span>
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 font-light">
          Deep diagnostic metrics analyzing velocity, cognitive difficulty index, and urgency distributions.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {[
          {
            label: 'Overall Productivity',
            val: `${productivity}%`,
            sub: `${completed} / ${total} cleared`,
            icon: TrendingUp,
            color: 'text-rose-500',
            bg: 'bg-rose-500/10',
          },
          {
            label: 'Active Workload',
            val: `${totalEstimatedHours} hrs`,
            sub: `${pending} active tasks`,
            icon: Clock,
            color: 'text-neutral-900 dark:text-white',
            bg: 'bg-neutral-100 dark:bg-white/10',
          },
          {
            label: 'Avg. Importance',
            val: `${avgImportance}/10`,
            sub: 'High-value focus ratio',
            icon: Target,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
          },
          {
            label: 'Avg. Complexity',
            val: `${avgDifficulty}/10`,
            sub: 'Cognitive effort index',
            icon: Zap,
            color: 'text-indigo-400',
            bg: 'bg-indigo-500/10',
          },
        ].map((kpi, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -3 }}
            className="p-5 rounded-2xl bg-white/90 dark:bg-[#0D0E14]/90 border border-neutral-200/80 dark:border-white/10 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-neutral-400">
                {kpi.label}
              </span>
              <div className={`p-2 rounded-lg ${kpi.bg} ${kpi.color}`}>
                <kpi.icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-neutral-900 dark:text-white">
                {kpi.val}
              </div>
              <div className="text-[11px] text-neutral-400 font-mono mt-0.5">{kpi.sub}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Vector Charts */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] font-mono text-neutral-900 dark:text-white">
          Visual Breakdown
        </h2>
        <AnimatedCharts tasks={tasks} />
      </div>

      {/* Strategic Insight Summary Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-neutral-100/90 dark:bg-[#0D0E14]/90 border border-neutral-200/80 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-black">
            <Sparkles className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm uppercase tracking-wider font-mono text-neutral-900 dark:text-white">
              Editorial Productivity Heuristics
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light">
              Algorithmic intelligence synthesized from active inventory metrics.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-white/90 dark:bg-[#090A0F]/90 border border-neutral-200 dark:border-white/10 space-y-1">
            <span className="text-xs font-mono font-bold text-rose-500">
              ✦ Workload Balance
            </span>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
              {totalEstimatedHours > 20
                ? 'Your active backlog contains heavy commitments (>20 hrs). Consider delegating or breaking down larger goals.'
                : 'Your active backlog is well-proportioned and feasible for high-velocity weekly delivery.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/90 dark:bg-[#090A0F]/90 border border-neutral-200 dark:border-white/10 space-y-1">
            <span className="text-xs font-mono font-bold text-amber-500">
              ✦ Urgency Distribution
            </span>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
              {refreshed.filter((t) => !t.completed && t.priorityLevel === 'critical').length > 0
                ? 'Critical priority items exist. Guard your mornings for uninterrupted deep focus on Q1 items.'
                : 'No critical schedule panics currently. Perfect time to invest in Quadrant II preparation.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/90 dark:bg-[#090A0F]/90 border border-neutral-200 dark:border-white/10 space-y-1">
            <span className="text-xs font-mono font-bold text-emerald-500">
              ✦ Completion Velocity
            </span>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
              {productivity >= 50
                ? 'Strong completion velocity! Maintaining momentum with small quick wins drives compound progress.'
                : 'Focus on 1–2 quick wins (≤ 1 hour) today to jumpstart completion inertia.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
