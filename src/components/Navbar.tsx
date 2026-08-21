import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, Plus, Bell, Volume2, VolumeX, Moon, Sun, Flame, AlertCircle, Clock, X } from 'lucide-react';
import { Task, ThemeMode } from '../types';
import { formatDeadlineText, isOverdue } from '../utils/priorityEngine';
import { sounds } from '../utils/soundEffects';

interface NavbarProps {
  onOpenMobileMenu: () => void;
  onOpenAddModal: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  tasks: Task[];
  onStartFocus: (task: Task) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMobileMenu,
  onOpenAddModal,
  theme,
  onToggleTheme,
  soundEnabled,
  onToggleSound,
  tasks,
  onStartFocus,
}) => {
  const [showNotifs, setShowNotifs] = useState(false);

  const overdue = tasks.filter(isOverdue);
  const critical = tasks.filter((t) => !t.completed && t.priorityLevel === 'critical');
  const alertCount = overdue.length + critical.length;

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#080808]/80 backdrop-blur-xl border-b border-neutral-200/80 dark:border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={() => {
            sounds.playPop();
            onOpenMobileMenu();
          }}
          className="md:hidden p-2 rounded-xl text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 dark:text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="text-[10px] uppercase tracking-[0.25em] font-mono font-bold text-rose-500 dark:text-rose-400">
              PRIORITY ENGINE V4
            </span>
          </div>
          <span className="text-neutral-300 dark:text-white/20">|</span>
          <span className="text-xs font-light italic font-editorial-serif text-neutral-600 dark:text-neutral-300">
            Real-time algorithmic dispatch
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Sound Toggle */}
        <button
          onClick={() => {
            sounds.playPop();
            onToggleSound();
          }}
          title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
          className="p-2 rounded-xl text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-rose-500" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => {
            sounds.playPop();
            onToggleTheme();
          }}
          title="Cycle Theme"
          className="p-2 rounded-xl text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors"
        >
          {theme === 'clean-light' || theme === 'editorial-light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>

        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              sounds.playPop();
              setShowNotifs(!showNotifs);
            }}
            title="Notifications"
            className="p-2 rounded-xl text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {alertCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#080808] animate-pulse" />
            )}
          </button>

          {/* Popover */}
          <AnimatePresence>
            {showNotifs && (
              <>
                <div
                  onClick={() => setShowNotifs(false)}
                  className="fixed inset-0 z-40"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 5 }}
                  className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-white/95 dark:bg-[#0D0E14]/95 border border-neutral-200 dark:border-white/15 backdrop-blur-2xl shadow-2xl z-50 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-white/10">
                    <span className="font-bold text-[10px] uppercase tracking-[0.25em] text-rose-500">
                      Priority Alerts ({alertCount})
                    </span>
                    <button
                      onClick={() => setShowNotifs(false)}
                      className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {overdue.map((t) => (
                      <div
                        key={t.id}
                        className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-rose-500 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> Overdue Task
                          </span>
                          <span className="font-mono text-[10px] text-rose-500 font-bold">
                            Score: {t.priorityScore}
                          </span>
                        </div>
                        <div className="font-semibold text-neutral-900 dark:text-white truncate">
                          {t.title}
                        </div>
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                          {formatDeadlineText(t.deadline).text}
                        </div>
                      </div>
                    ))}

                    {critical.filter((t) => !isOverdue(t)).map((t) => (
                      <div
                        key={t.id}
                        className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5" /> Critical Priority
                          </span>
                          <span className="font-mono text-[10px] text-amber-500 font-bold">
                            Score: {t.priorityScore}
                          </span>
                        </div>
                        <div className="font-semibold text-neutral-900 dark:text-white truncate">
                          {t.title}
                        </div>
                      </div>
                    ))}

                    {alertCount === 0 && (
                      <div className="text-center py-6 text-xs text-neutral-400">
                        ✨ All deadlines and critical queues are clear!
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Add Task Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            sounds.playWhoosh();
            onOpenAddModal();
          }}
          className="px-4 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-100 text-xs font-black uppercase tracking-wider shadow-md flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Task</span>
        </motion.button>
      </div>
    </header>
  );
};
