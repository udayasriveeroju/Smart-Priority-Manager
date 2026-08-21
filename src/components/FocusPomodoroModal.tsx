import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, RotateCcw, CheckCircle, Flame, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { Task } from '../types';
import { PRIORITY_THEMES } from '../utils/priorityEngine';
import { sounds } from '../utils/soundEffects';
import { fireTaskConfetti } from '../utils/confetti';

interface FocusPomodoroModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onCompleteTask: (taskId: string) => void;
}

export const FocusPomodoroModal: React.FC<FocusPomodoroModalProps> = ({
  task,
  isOpen,
  onClose,
  onCompleteTask,
}) => {
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'pomodoro' | 'short' | 'long'>('pomodoro');
  const [notes, setNotes] = useState('');

  // Mode durations
  const setTimerMode = (newMode: 'pomodoro' | 'short' | 'long') => {
    sounds.playPop();
    setMode(newMode);
    setIsRunning(false);
    const secs = newMode === 'pomodoro' ? 25 * 60 : newMode === 'short' ? 5 * 60 : 15 * 60;
    setTotalSeconds(secs);
    setSecondsLeft(secs);
  };

  // Timer Tick
  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            sounds.playTimerBell();
            fireTaskConfetti();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setTimerMode('pomodoro');
      setNotes('');
    }
  }, [isOpen, task?.id]);

  if (!task) return null;

  const priorityTheme = PRIORITY_THEMES[task.priorityLevel];
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressPercent = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  const handleComplete = () => {
    sounds.playComplete();
    fireTaskConfetti();
    onCompleteTask(task.id);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Deep Focus Backdrop with subtle animated ambient particles */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl bg-[#0D0E14] border border-white/10 rounded-2xl p-6 sm:p-8 text-white shadow-2xl z-10 my-auto text-center"
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-lg text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Task Banner */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/[0.04] border border-white/10 text-xs font-mono mb-3">
              <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              <span>SCORE: {task.priorityScore}/100</span>
              <span className="text-neutral-600">•</span>
              <span className="text-neutral-300 uppercase">{task.category}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-light italic font-editorial-serif text-white mb-2 px-6">
              {task.title}
            </h2>

            {task.description && (
              <p className="text-xs text-neutral-400 max-w-md mx-auto mb-6 line-clamp-2 font-light">
                {task.description}
              </p>
            )}

            {/* Mode Selectors */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {[
                { id: 'pomodoro', label: '25M FOCUS' },
                { id: 'short', label: '5M BREAK' },
                { id: 'long', label: '15M RESET' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setTimerMode(m.id as any)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                    mode === m.id
                      ? 'bg-white text-black shadow-lg shadow-white/10'
                      : 'bg-white/[0.04] text-neutral-400 hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Big Animated Circular Breathing Gauge */}
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 mx-auto mb-8 flex items-center justify-center">
              {/* Outer pulsing ring when running */}
              {isRunning && (
                <motion.div
                  animate={{
                    scale: [1, 1.08, 1],
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute inset-0 rounded-full bg-rose-500/20 blur-xl"
                />
              )}

              <svg className="w-full h-full transform -rotate-90 origin-center" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-white/10"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="url(#focusGrad)"
                  strokeWidth="4"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * progressPercent) / 100}
                  strokeLinecap="round"
                  transition={{ duration: 0.5 }}
                />
                <defs>
                  <linearGradient id="focusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="100%" stopColor="#ffffff" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Time Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
                <motion.span
                  key={formattedTime}
                  initial={{ scale: 0.98 }}
                  animate={{ scale: 1 }}
                  className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white drop-shadow-md"
                >
                  {formattedTime}
                </motion.span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-neutral-400 mt-1">
                  {isRunning ? '✦ DEEP SESSION' : 'PAUSED'}
                </span>
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  sounds.playPop();
                  setTimerMode(mode);
                }}
                className="p-3.5 rounded-xl bg-white/[0.06] text-neutral-400 hover:text-white transition-colors"
                title="Reset timer"
              >
                <RotateCcw className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  sounds.playPop();
                  setIsRunning(!isRunning);
                }}
                className={`px-8 py-3.5 rounded-xl font-mono font-bold text-xs uppercase tracking-wider shadow-xl flex items-center gap-2 transition-all ${
                  isRunning
                    ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20'
                    : 'bg-white hover:bg-neutral-200 text-black shadow-white/20'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>{secondsLeft === totalSeconds ? 'Start Session' : 'Resume'}</span>
                  </>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleComplete}
                className="px-4 py-3.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                title="Mark task done and finish"
              >
                <CheckCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Finish</span>
              </motion.button>
            </div>

            {/* Quick Session Scratchpad */}
            <div className="text-left bg-white/[0.03] border border-white/10 rounded-xl p-3">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-500 block mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Focus Session Scratchpad / Insights:
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Log thoughts, next action, or ideas..."
                className="w-full bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none font-light"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
