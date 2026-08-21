import React from 'react';
import { motion } from 'motion/react';
import { Moon, Sun, Volume2, VolumeX, Download, Upload, RotateCcw, LogOut, Sparkles, Palette, Shield, Heart } from 'lucide-react';
import { ThemeMode, User, Task } from '../../types';
import { sounds } from '../../utils/soundEffects';

interface SettingsViewProps {
  user: User;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetDemoData: () => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogout: () => void;
}

const THEMES: { id: ThemeMode; name: string; desc: string; colors: string[] }[] = [
  {
    id: 'editorial-dark',
    name: 'Editorial Dark (Default)',
    desc: 'High-contrast obsidian canvas with serif typography, rose & indigo accents',
    colors: ['#080808', '#0D0E14', '#F43F5E', '#6366F1'],
  },
  {
    id: 'editorial-light',
    name: 'Editorial Light',
    desc: 'Architectural ivory & slate with crisp hairline borders & rose accents',
    colors: ['#F9F9F8', '#FFFFFF', '#E11D48', '#4F46E5'],
  },
  {
    id: 'aurora-dark',
    name: 'Aurora Dark',
    desc: 'Deep cosmic slate with vibrant neon accents',
    colors: ['#0B0F19', '#1E293B', '#6366F1', '#EC4899'],
  },
  {
    id: 'clean-light',
    name: 'Clean Light',
    desc: 'Refined modern light palette with crisp typography',
    colors: ['#FFFFFF', '#EEF2F6', '#4F46E5', '#10B981'],
  },
  {
    id: 'cyber-neon',
    name: 'Cyberpunk Neon',
    desc: 'High-contrast midnight dark with electric magenta & cyan',
    colors: ['#090A0F', '#131722', '#06B6D4', '#F43F5E'],
  },
  {
    id: 'sunset-glow',
    name: 'Sunset Glow',
    desc: 'Warm evening twilight with amber & coral hues',
    colors: ['#18101E', '#2B1A35', '#F59E0B', '#FF3366'],
  },
  {
    id: 'emerald-zen',
    name: 'Emerald Zen',
    desc: 'Peaceful deep forest & soothing mint highlights',
    colors: ['#0A1612', '#142721', '#10B981', '#34D399'],
  },
];

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  theme,
  onThemeChange,
  soundEnabled,
  onToggleSound,
  onResetDemoData,
  onExportData,
  onImportData,
  onLogout,
}) => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Customize themes, sound effects, data backups, and account settings.
        </p>
      </div>

      {/* Theme Picker */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <Palette className="w-5 h-5 text-indigo-500" />
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Visual Theme Atmosphere
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select your favorite animated color theme.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {THEMES.map((th) => {
            const isSelected = theme === th.id;
            return (
              <motion.button
                key={th.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  sounds.playPop();
                  onThemeChange(th.id);
                }}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/30 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {th.name}
                  </span>
                  <div className="flex items-center gap-1">
                    {th.colors.map((c, i) => (
                      <div
                        key={i}
                        className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {th.desc}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Sound FX */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500">
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Audio Feedback & Chimes
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Plays rewarding synthetic chord chimes on task completion and gentle pops on clicks.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {soundEnabled && (
            <button
              onClick={() => sounds.playComplete()}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
            >
              Test Sound
            </button>
          )}

          <button
            onClick={() => {
              sounds.playPop();
              onToggleSound();
            }}
            className={`w-12 h-7 rounded-full transition-colors relative flex items-center p-1 ${
              soundEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <motion.div
              layout
              className="w-5 h-5 rounded-full bg-white shadow-md"
              animate={{ x: soundEnabled ? 20 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
      </div>

      {/* Data Management & Backup */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Data Backup & Storage
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Export your tasks to JSON or restore from a backup file.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={onExportData}
            className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 text-indigo-500" />
            <span>Export Tasks JSON</span>
          </button>

          <label className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-indigo-500" />
            <span>Import Tasks JSON</span>
            <input type="file" accept=".json" onChange={onImportData} className="hidden" />
          </label>

          <button
            onClick={() => {
              if (confirm('Reset to rich demo tasks? Current tasks will be replaced with fresh sample tasks.')) {
                onResetDemoData();
              }
            }}
            className="px-4 py-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Tasks</span>
          </button>
        </div>
      </div>

      {/* Account & Session */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              User Profile
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Logged in as <span className="font-semibold text-slate-700 dark:text-slate-300">{user.email}</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-indigo-600/25">
            {user.name.slice(0, 1).toUpperCase()}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <span className="text-xs text-slate-400 font-mono">
            Smart Priority Manager v4.0
          </span>
          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
