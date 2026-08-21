import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PriorityLevel } from '../types';
import { PRIORITY_THEMES, getPriorityBreakdown } from '../utils/priorityEngine';

interface AnimatedPriorityDialProps {
  score: number;
  level?: PriorityLevel;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'hero';
  showLabel?: boolean;
  interactive?: boolean;
  showBreakdownOnHover?: boolean;
  taskData?: {
    deadline: string;
    importance: number;
    difficulty: number;
    estimatedTime: number;
  };
}

export const AnimatedPriorityDial: React.FC<AnimatedPriorityDialProps> = ({
  score,
  size = 'md',
  showLabel = false,
  interactive = true,
  showBreakdownOnHover = true,
  taskData,
}) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const clampedScore = Math.min(100, Math.max(0, Math.round(score)));
  const level: PriorityLevel = clampedScore >= 80 ? 'critical' : clampedScore >= 60 ? 'high' : clampedScore >= 40 ? 'medium' : 'low';
  const theme = PRIORITY_THEMES[level];

  // Config sizes
  const config = {
    xs: { dim: 36, stroke: 4, font: 'text-xs font-bold', sub: 'text-[9px]' },
    sm: { dim: 46, stroke: 5, font: 'text-sm font-extrabold', sub: 'text-[10px]' },
    md: { dim: 62, stroke: 6, font: 'text-lg font-black tracking-tight', sub: 'text-xs' },
    lg: { dim: 90, stroke: 8, font: 'text-2xl font-black tracking-tight', sub: 'text-xs' },
    hero: { dim: 140, stroke: 12, font: 'text-4xl font-black tracking-tighter', sub: 'text-sm' },
  }[size];

  const radius = (config.dim - config.stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  // Animated counter
  useEffect(() => {
    let start = displayScore;
    const end = clampedScore;
    if (start === end) return;
    const duration = 600;
    const startTime = performance.now();

    const animateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * ease);
      setDisplayScore(current);

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };

    requestAnimationFrame(animateCount);
  }, [clampedScore]);

  // Breakdown details if task data is provided
  const breakdown = taskData
    ? getPriorityBreakdown(taskData)
    : {
        deadlineWeight: Math.round(clampedScore * 0.4),
        importanceWeight: Math.round(clampedScore * 0.3),
        difficultyWeight: Math.round(clampedScore * 0.15),
        timeUrgencyWeight: Math.round(clampedScore * 0.15),
      };

  return (
    <div
      className="relative inline-flex flex-col items-center justify-center group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative flex items-center justify-center select-none"
        style={{ width: config.dim, height: config.dim }}
      >
        {/* Glow backdrop on high & critical priorities */}
        {(level === 'critical' || level === 'high') && (
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.35, 0.65, 0.35],
            }}
            transition={{
              duration: level === 'critical' ? 1.8 : 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 rounded-full blur-md -z-10"
            style={{ backgroundColor: theme.color }}
          />
        )}

        <svg
          width={config.dim}
          height={config.dim}
          viewBox={`0 0 ${config.dim} ${config.dim}`}
          className="transform -rotate-90 origin-center"
        >
          <defs>
            <linearGradient id={`grad-${level}-${config.dim}`} x1="0%" y1="0%" x2="100%" y2="100%">
              {level === 'critical' && (
                <>
                  <stop offset="0%" stopColor="#FF1493" />
                  <stop offset="50%" stopColor="#FF3366" />
                  <stop offset="100%" stopColor="#FF6B00" />
                </>
              )}
              {level === 'high' && (
                <>
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#EA580C" />
                </>
              )}
              {level === 'medium' && (
                <>
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </>
              )}
              {level === 'low' && (
                <>
                  <stop offset="0%" stopColor="#34D399" />
                  <stop offset="100%" stopColor="#10B981" />
                </>
              )}
            </linearGradient>
            <filter id={`glow-${config.dim}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor={theme.color} floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Background track */}
          <circle
            cx={config.dim / 2}
            cy={config.dim / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.stroke}
            className="text-slate-200 dark:text-slate-800 transition-colors"
          />

          {/* Animated fill circle */}
          <motion.circle
            cx={config.dim / 2}
            cy={config.dim / 2}
            r={radius}
            fill="none"
            stroke={`url(#grad-${level}-${config.dim})`}
            strokeWidth={config.stroke}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            strokeLinecap="round"
            style={{
              filter: size === 'hero' || size === 'lg' ? `url(#glow-${config.dim})` : undefined,
            }}
          />
        </svg>

        {/* Center Number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <motion.span
            key={level}
            initial={{ scale: 0.9, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`font-mono ${config.font}`}
            style={{ color: theme.color }}
          >
            {displayScore}
          </motion.span>
          {size === 'hero' && (
            <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 mt-0.5">
              Score / 100
            </span>
          )}
        </div>
      </div>

      {showLabel && (
        <div className="mt-1 flex items-center gap-1">
          <span className="text-xs font-semibold" style={{ color: theme.color }}>
            {theme.flameEmoji} {theme.badge}
          </span>
        </div>
      )}

      {/* Hover Formula Breakdown Tooltip */}
      <AnimatePresence>
        {isHovered && showBreakdownOnHover && interactive && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 w-56 p-3 rounded-xl bg-slate-900/95 text-slate-100 text-xs shadow-2xl backdrop-blur-md border border-slate-700/80 pointer-events-none"
          >
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-1.5 mb-2">
              <span className="font-bold flex items-center gap-1.5" style={{ color: theme.color }}>
                <span>{theme.flameEmoji}</span> {theme.label}
              </span>
              <span className="font-mono font-bold text-white bg-slate-800 px-1.5 py-0.5 rounded text-[11px]">
                {clampedScore} / 100
              </span>
            </div>

            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between items-center text-slate-300">
                <span>⏳ Urgency (40%)</span>
                <span className="font-mono font-semibold text-rose-400">+{breakdown.deadlineWeight}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>⭐ Importance (30%)</span>
                <span className="font-mono font-semibold text-amber-400">+{breakdown.importanceWeight}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>⚡ Difficulty (15%)</span>
                <span className="font-mono font-semibold text-blue-400">+{breakdown.difficultyWeight}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>⏱️ Time Needed (15%)</span>
                <span className="font-mono font-semibold text-emerald-400">+{breakdown.timeUrgencyWeight}</span>
              </div>
            </div>

            <div className="mt-2 pt-1.5 border-t border-slate-800 text-[10px] text-slate-400 text-center italic">
              Smart Prioritization Formula
            </div>

            {/* Triangle pointer */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-slate-900/95" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
