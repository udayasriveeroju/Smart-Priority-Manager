import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, RotateCcw, Flame, CheckCircle, Sparkles, Clock, ArrowRight, Compass } from 'lucide-react';
import { Task } from '../../types';
import { PRIORITY_THEMES, formatDeadlineText, getSmartRecommendations, refreshTask } from '../../utils/priorityEngine';
import { AnimatedPriorityDial } from '../AnimatedPriorityDial';
import { sounds } from '../../utils/soundEffects';
import { fireTaskConfetti } from '../../utils/confetti';

interface FocusViewProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onOpenAddModal: () => void;
}

export const FocusView: React.FC<FocusViewProps> = ({
  tasks,
  onToggleTask,
  onOpenAddModal,
}) => {
  const activeTasks = tasks.filter((t) => !t.completed).map(refreshTask).sort((a, b) => b.priorityScore - a.priorityScore);
  const [selectedTask, setSelectedTask] = useState<Task | null>(activeTasks[0] || null);

  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'pomodoro' | 'short' | 'long'>('pomodoro');
  const [completedSessions, setCompletedSessions] = useState(0);

  // Keep selected task in sync if tasks change
  useEffect(() => {
    if (selectedTask) {
      const found = activeTasks.find((t) => t.id === selectedTask.id);
      if (!found) {
        setSelectedTask(activeTasks[0] || null);
      }
    } else if (activeTasks.length > 0) {
      setSelectedTask(activeTasks[0]);
    }
  }, [tasks]);

  const setTimerMode = (newMode: 'pomodoro' | 'short' | 'long') => {
    sounds.playPop();
    setMode(newMode);
    setIsRunning(false);
    const secs = newMode === 'pomodoro' ? 25 * 60 : newMode === 'short' ? 5 * 60 : 15 * 60;
    setTotalSeconds(secs);
    setSecondsLeft(secs);
  };

  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            sounds.playTimerBell();
            fireTaskConfetti();
            setCompletedSessions((c) => c + 1);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressPercent = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  const handleFinishCurrent = () => {
    if (!selectedTask) return;
    sounds.playComplete();
    fireTaskConfetti();
    onToggleTask(selectedTask.id);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="text-[9px] uppercase tracking-[0.25em] font-bold text-rose-500">
          DEEP WORK PROTOCOL
        </div>
        <h1 className="text-2xl sm:text-3xl font-light italic font-editorial-serif tracking-tight text-neutral-900 dark:text-white flex items-center gap-3">
          <Flame className="w-6 h-6 text-rose-500" />
          <span>Hyper Focus Chamber</span>
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
          Zero-distraction sprint environment calibrated for single-task mastery.
        </p>
      </div>

      {selectedTask ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Focus Centerpiece */}
          <div className="lg:col-span-7 rounded-2xl bg-white/90 dark:bg-[#0D0E14]/90 border border-neutral-200/80 dark:border-white/10 p-6 sm:p-8 shadow-2xl text-center space-y-6 relative overflow-hidden backdrop-blur-xl">
            {/* Ambient Background Glow */}
            {isRunning && (
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.35, 0.15] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 bg-gradient-to-br from-rose-500/20 via-indigo-500/15 to-cyan-500/15 blur-3xl pointer-events-none"
              />
            )}

            {/* Active Task Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-white/10 border border-neutral-200 dark:border-white/10 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span className="text-neutral-900 dark:text-white">SCORE #{selectedTask.priorityScore}</span>
              <span className="text-neutral-400">•</span>
              <span className="text-rose-500">{selectedTask.category}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white max-w-md mx-auto tracking-tight">
              {selectedTask.title}
            </h2>

            {selectedTask.description && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto line-clamp-2 font-light">
                {selectedTask.description}
              </p>
            )}

            {/* Mode Selectors */}
            <div className="flex items-center justify-center gap-2">
              {[
                { id: 'pomodoro', label: '25m Sprint' },
                { id: 'short', label: '5m Interval' },
                { id: 'long', label: '15m Reset' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setTimerMode(m.id as any)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                    mode === m.id
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-md'
                      : 'bg-neutral-100 dark:bg-white/[0.05] text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Big Circular Animated Gauge */}
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90 origin-center" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  className="text-neutral-200 dark:text-white/10"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="url(#focusHubGrad)"
                  strokeWidth="5"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * progressPercent) / 100}
                  strokeLinecap="round"
                  transition={{ duration: 0.5 }}
                />
                <defs>
                  <linearGradient id="focusHubGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="50%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
                <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-neutral-900 dark:text-white">
                  {formattedTime}
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-neutral-400 mt-1">
                  {isRunning ? 'ACTIVE SPRINT' : 'STANDBY'}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  sounds.playPop();
                  setTimerMode(mode);
                }}
                className="p-3.5 rounded-xl bg-neutral-100 dark:bg-white/[0.06] text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                title="Reset timer"
              >
                <RotateCcw className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  sounds.playPop();
                  setIsRunning(!isRunning);
                }}
                className={`px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center gap-2 transition-all ${
                  isRunning
                    ? 'bg-amber-400 hover:bg-amber-300 text-black shadow-amber-500/20'
                    : 'bg-neutral-900 text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-100 shadow-xl'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current text-rose-500" />
                    <span>{secondsLeft === totalSeconds ? 'Start Sprint' : 'Resume'}</span>
                  </>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleFinishCurrent}
                className="px-4 py-3.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 font-mono"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Finished</span>
              </motion.button>
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-white/10 text-xs text-neutral-400 flex items-center justify-around font-mono text-[11px]">
              <span>COMPLETED SPRINTS: <b className="text-rose-500 font-bold">{completedSessions}</b></span>
              <span>TARGET DEADLINE: <b className="text-neutral-700 dark:text-neutral-300 font-bold">{formatDeadlineText(selectedTask.deadline).text}</b></span>
            </div>
          </div>

          {/* Up Next Focus Queue */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-xs uppercase tracking-[0.2em] font-mono text-neutral-900 dark:text-white">
                PRIORITY QUEUE
              </h3>
              <span className="text-[11px] font-mono text-neutral-400 font-bold">
                {activeTasks.length} WAITING
              </span>
            </div>

            <div className="space-y-3">
              {activeTasks.map((t, idx) => {
                const isSelected = selectedTask.id === t.id;
                const d = formatDeadlineText(t.deadline);
                return (
                  <motion.div
                    key={t.id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => {
                      sounds.playPop();
                      setSelectedTask(t);
                    }}
                    className={`p-4 rounded-xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-rose-500/10 dark:bg-rose-950/30 border-rose-500 ring-1 ring-rose-500/30 shadow-md'
                        : 'bg-white/90 dark:bg-[#0D0E14]/90 border-neutral-200/80 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <AnimatedPriorityDial
                          score={t.priorityScore}
                          size="xs"
                          interactive={false}
                        />
                        <div className="min-w-0">
                          <h4 className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-white truncate">
                            {t.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400 mt-0.5">
                            <span className={d.isUrgent ? 'text-rose-500 font-bold' : ''}>
                              {d.text}
                            </span>
                            <span>•</span>
                            <span>{t.estimatedTime}h</span>
                            <span>•</span>
                            <span>{t.category}</span>
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded bg-rose-500 text-white flex-shrink-0">
                          Active
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 rounded-2xl bg-white/90 dark:bg-[#0D0E14]/90 border border-neutral-200/80 dark:border-white/10 text-center space-y-4">
          <div className="w-14 h-14 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
            <Compass className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-light italic font-editorial-serif text-neutral-900 dark:text-white">
            All Focus Targets Cleared
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto font-light">
            You've achieved complete task liberation. Take a restful reset or plan strategic next horizons.
          </p>
          <button
            onClick={onOpenAddModal}
            className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black text-xs font-black uppercase tracking-wider shadow-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all"
          >
            + Schedule Horizon Goal
          </button>
        </div>
      )}
    </div>
  );
};
