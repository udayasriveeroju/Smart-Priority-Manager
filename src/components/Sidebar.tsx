import React from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, CheckSquare, Flame, Bot, BarChart2, Grid, Settings, LogOut, Sparkles, X } from 'lucide-react';
import { Task, User } from '../types';
import { isOverdue } from '../utils/priorityEngine';
import { sounds } from '../utils/soundEffects';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  tasks: Task[];
  user: User;
  onLogout: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  tasks,
  user,
  onLogout,
  isOpenMobile,
  onCloseMobile,
}) => {
  const activeCount = tasks.filter((t) => !t.completed).length;
  const overdueCount = tasks.filter(isOverdue).length;

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'My Tasks', icon: CheckSquare, badge: activeCount },
    { id: 'focus', label: "Today's Focus", icon: Flame, badge: Math.min(3, activeCount), alert: overdueCount > 0 },
    { id: 'matrix', label: 'Eisenhower Matrix', icon: Grid },
    { id: 'ai', label: 'AI Strategist', icon: Bot, highlight: true },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNav = (id: string) => {
    sounds.playPop();
    onSelectTab(id);
    onCloseMobile();
  };

  const content = (
    <div className="flex flex-col h-full justify-between p-4 sm:p-5 bg-white/90 dark:bg-[#080808]/95 backdrop-blur-xl border-r border-neutral-200/80 dark:border-white/10">
      <div className="space-y-6">
        {/* Editorial Brand Header */}
        <div className="flex items-center justify-between px-2 pt-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-rose-500">
                  SMART v.4
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] font-mono px-1.5 py-0.2 bg-white/10 dark:bg-white/10 rounded text-neutral-500 dark:text-neutral-400">
                  EST. 2026
                </span>
              </div>
              <h2 className="text-xl font-light italic tracking-tight font-editorial-serif text-neutral-900 dark:text-white">
                Priority Manager
              </h2>
            </div>
          </div>

          {/* Close for mobile drawer */}
          <button
            onClick={onCloseMobile}
            className="md:hidden p-2 rounded-xl text-neutral-400 hover:text-neutral-600 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section divider eyebrow */}
        <div className="px-2 pt-2 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] font-bold text-neutral-400 dark:text-neutral-500">
          <span>Workspaces</span>
          <span className="font-mono text-[9px]">07 MODES</span>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
                  isActive
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-lg font-black tracking-wide'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? 'text-rose-500 dark:text-rose-600'
                        : item.highlight
                        ? 'text-rose-400'
                        : 'text-neutral-400 dark:text-neutral-500'
                    }`}
                  />
                  <span className="tracking-tight">{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider ${
                      isActive
                        ? 'bg-black/10 dark:bg-black/20 text-neutral-900 dark:text-black'
                        : item.alert
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-neutral-200 dark:bg-white/10 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </motion.button>
            );
          })}
        </nav>
      </div>

      {/* User Footer Profile Chip */}
      <div className="pt-4 border-t border-neutral-200/80 dark:border-white/10 space-y-3">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-neutral-50 dark:bg-white/[0.04] border border-neutral-200/80 dark:border-white/10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-500 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
            {user.name.slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-bold text-xs text-neutral-900 dark:text-white truncate">
              {user.name}
            </div>
            <div className="text-[10px] text-neutral-400 dark:text-neutral-500 truncate font-mono">
              {user.email}
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playPop();
              onLogout();
            }}
            title="Log Out"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden md:block w-64 h-screen sticky top-0 flex-shrink-0 z-30">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
          />
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-72 h-full z-10 shadow-2xl"
          >
            {content}
          </motion.div>
        </div>
      )}
    </>
  );
};
