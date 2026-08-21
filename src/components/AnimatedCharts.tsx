import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Task } from '../types';
import { CATEGORY_COLORS, PRIORITY_THEMES, priorityLevel, refreshTask } from '../utils/priorityEngine';

interface AnimatedChartsProps {
  tasks: Task[];
}

export const AnimatedCharts: React.FC<AnimatedChartsProps> = ({ tasks }) => {
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  const refreshed = tasks.map(refreshTask);
  const total = refreshed.length;
  const completed = refreshed.filter((t) => t.completed).length;
  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Priority counts
  const priCounts = {
    critical: refreshed.filter((t) => !t.completed && t.priorityLevel === 'critical').length,
    high: refreshed.filter((t) => !t.completed && t.priorityLevel === 'high').length,
    medium: refreshed.filter((t) => !t.completed && t.priorityLevel === 'medium').length,
    low: refreshed.filter((t) => !t.completed && t.priorityLevel === 'low').length,
  };

  const maxPriCount = Math.max(1, priCounts.critical, priCounts.high, priCounts.medium, priCounts.low);

  // Category breakdown
  const catCounts: Record<string, number> = {};
  refreshed.forEach((t) => {
    catCounts[t.category] = (catCounts[t.category] || 0) + 1;
  });
  const catEntries = Object.entries(catCounts).sort((a, b) => b[1] - a[1]);

  // 7-day completion velocity
  const now = new Date();
  const daysVelocity = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;
    const count = refreshed.filter(
      (t) => t.completedAt && t.completedAt >= dayStart && t.completedAt < dayEnd
    ).length;
    return {
      day: d.toLocaleDateString(undefined, { weekday: 'short' }),
      count,
    };
  });

  const maxDaily = Math.max(1, ...daysVelocity.map((d) => d.count));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* 1. Donut Completion Meter */}
      <motion.div
        whileHover={{ y: -3 }}
        className="p-5 rounded-2xl bg-white/90 dark:bg-[#0D0E14]/90 border border-neutral-200/80 dark:border-white/10 shadow-sm flex flex-col items-center justify-between"
      >
        <div className="w-full flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-neutral-400">
            COMPLETION RATE
          </span>
          <span className="text-[10px] font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
            {completed}/{total} Done
          </span>
        </div>

        <div className="relative w-36 h-36 flex items-center justify-center my-2">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className="text-neutral-200 dark:text-white/10"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="url(#donutGrad)"
              strokeWidth="6"
              strokeDasharray="238.76"
              strokeDashoffset={238.76 - (238.76 * completionRate) / 100}
              strokeLinecap="round"
              initial={{ strokeDashoffset: 238.76 }}
              animate={{ strokeDashoffset: 238.76 - (238.76 * completionRate) / 100 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="donutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-black font-mono text-neutral-900 dark:text-white">
              {completionRate}%
            </span>
            <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-neutral-400">VELOCITY</span>
          </div>
        </div>

        <div className="w-full flex justify-around text-xs text-neutral-500 pt-2 border-t border-neutral-100 dark:border-white/10 font-mono text-[11px]">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{completed} Done</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-rose-500" />
            <span>{pending} Active</span>
          </div>
        </div>
      </motion.div>

      {/* 2. Priority Distribution Bar Spectrum */}
      <motion.div
        whileHover={{ y: -3 }}
        className="p-5 rounded-2xl bg-white/90 dark:bg-[#0D0E14]/90 border border-neutral-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-neutral-400">
            PENDING LEVEL
          </span>
          <span className="text-[10px] font-mono text-neutral-400">{pending} Pending</span>
        </div>

        <div className="flex items-end justify-around gap-2 h-36 pt-4 pb-2">
          {(
            [
              { key: 'critical', label: 'Crit', count: priCounts.critical, color: PRIORITY_THEMES.critical.color },
              { key: 'high', label: 'High', count: priCounts.high, color: PRIORITY_THEMES.high.color },
              { key: 'medium', label: 'Med', count: priCounts.medium, color: PRIORITY_THEMES.medium.color },
              { key: 'low', label: 'Low', count: priCounts.low, color: PRIORITY_THEMES.low.color },
            ] as const
          ).map((item) => {
            const heightPercent = maxPriCount > 0 ? (item.count / maxPriCount) * 100 : 0;
            return (
              <div
                key={item.key}
                className="flex flex-col items-center flex-1 h-full justify-end group cursor-pointer"
                onMouseEnter={() => setHoveredBar(item.key)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                <span className="text-[10px] font-mono font-bold text-neutral-700 dark:text-neutral-200 mb-1">
                  {item.count}
                </span>
                <div className="w-full max-w-[28px] bg-neutral-100 dark:bg-white/[0.06] rounded-t-lg overflow-hidden flex flex-col justify-end h-24">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(8, heightPercent)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="w-full rounded-t-lg transition-all"
                    style={{
                      backgroundColor: item.color,
                      boxShadow: hoveredBar === item.key ? `0 0 12px ${item.color}80` : undefined,
                    }}
                  />
                </div>
                <span className="text-[10px] font-mono font-bold text-neutral-400 mt-1 uppercase">{item.label}</span>
              </div>
            );
          })}
        </div>

        <div className="text-[10px] font-mono text-center text-neutral-400 pt-2 border-t border-neutral-100 dark:border-white/10">
          Focus on <span className="font-bold text-rose-500">Critical & High</span> first
        </div>
      </motion.div>

      {/* 3. Category Breakdown */}
      <motion.div
        whileHover={{ y: -3 }}
        className="p-5 rounded-2xl bg-white/90 dark:bg-[#0D0E14]/90 border border-neutral-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-neutral-400">
            CATEGORIES
          </span>
          <span className="text-[10px] font-mono text-neutral-400">{catEntries.length} Types</span>
        </div>

        <div className="space-y-2 my-auto max-h-36 overflow-y-auto pr-1">
          {catEntries.slice(0, 4).map(([cat, count]) => {
            const catTheme = (CATEGORY_COLORS as any)[cat] || CATEGORY_COLORS.Education;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={cat} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: catTheme.iconColor }} />
                    {cat}
                  </span>
                  <span className="font-mono text-neutral-400 text-[11px]">{count} ({pct}%)</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-100 dark:bg-white/[0.08] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: catTheme.iconColor }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-[10px] font-mono text-center text-neutral-400 pt-2 border-t border-neutral-100 dark:border-white/10">
          Workload categorized across domains
        </div>
      </motion.div>

      {/* 4. 7-Day Completion Velocity */}
      <motion.div
        whileHover={{ y: -3 }}
        className="p-5 rounded-2xl bg-white/90 dark:bg-[#0D0E14]/90 border border-neutral-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-neutral-400">
            7-DAY VELOCITY
          </span>
          <span className="text-[9px] font-mono font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded">
            STREAK
          </span>
        </div>

        <div className="flex items-end justify-between gap-1.5 h-36 pt-4 pb-2">
          {daysVelocity.map((item, idx) => {
            const heightPercent = maxDaily > 0 ? (item.count / maxDaily) * 100 : 0;
            const isToday = idx === 6;
            return (
              <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end">
                <span className="text-[10px] font-mono text-neutral-400 mb-1">
                  {item.count > 0 ? item.count : '·'}
                </span>
                <div className="w-full bg-neutral-100 dark:bg-white/[0.06] rounded-t-md overflow-hidden flex flex-col justify-end h-24">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(6, heightPercent)}%` }}
                    transition={{ duration: 0.6, delay: idx * 0.05 }}
                    className={`w-full rounded-t-md ${
                      isToday
                        ? 'bg-rose-500'
                        : 'bg-neutral-400/60 dark:bg-white/20'
                    }`}
                  />
                </div>
                <span
                  className={`text-[9px] font-mono mt-1 ${
                    isToday ? 'text-rose-500 font-bold' : 'text-neutral-400'
                  }`}
                >
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>

        <div className="text-[10px] font-mono text-center text-neutral-400 pt-2 border-t border-neutral-100 dark:border-white/10">
          Weekly completed sprint cadence
        </div>
      </motion.div>
    </div>
  );
};
