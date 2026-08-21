import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Sliders, Wand2, Calendar, Clock, AlertTriangle, Layers, Check } from 'lucide-react';
import { Category, Task } from '../types';
import { CATEGORY_COLORS, computePriority, parseNaturalLanguage, priorityLevel, PRIORITY_THEMES } from '../utils/priorityEngine';
import { AnimatedPriorityDial } from './AnimatedPriorityDial';
import { sounds } from '../utils/soundEffects';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Task, 'id' | 'userId' | 'completed' | 'createdAt' | 'updatedAt' | 'completedAt' | 'priorityScore' | 'priorityLevel'>) => void;
  editingTask?: Task | null;
}

const CATEGORIES: Category[] = [
  'Education',
  'Work',
  'Personal',
  'Health',
  'Finance',
  'Home',
  'Creative',
  'Tech',
  'Errands',
];

const PRESETS = [
  { title: 'Prepare Final Project Presentation', cat: 'Education', imp: 9, diff: 7, time: 4, inDays: 2 },
  { title: 'Submit Urgent Bug Fix & Deploy', cat: 'Tech', imp: 9, diff: 6, time: 2, inDays: 1 },
  { title: 'Complete Course Assignment', cat: 'Education', imp: 8, diff: 5, time: 3, inDays: 3 },
  { title: 'Weekly Financial Review & Bills', cat: 'Finance', imp: 7, diff: 3, time: 1, inDays: 4 },
  { title: 'High-Intensity Cardio Workout', cat: 'Health', imp: 6, diff: 5, time: 1, inDays: 0 },
];

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingTask,
}) => {
  const [tab, setTab] = useState<'form' | 'nlp'>('form');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Education');
  const [deadline, setDeadline] = useState('');
  const [importance, setImportance] = useState(7);
  const [difficulty, setDifficulty] = useState(5);
  const [estimatedTime, setEstimatedTime] = useState(2);

  // NLP State
  const [nlpPrompt, setNlpPrompt] = useState('');
  const [detectedTokens, setDetectedTokens] = useState<{ type: string; value: string }[]>([]);

  // Initialize or reset form
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setCategory(editingTask.category);
      setDeadline(editingTask.deadline);
      setImportance(editingTask.importance);
      setDifficulty(editingTask.difficulty);
      setEstimatedTime(editingTask.estimatedTime);
      setTab('form');
    } else {
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 2);
      setTitle('');
      setDescription('');
      setCategory('Education');
      setDeadline(defaultDate.toISOString().slice(0, 10));
      setImportance(7);
      setDifficulty(5);
      setEstimatedTime(2);
      setNlpPrompt('');
      setDetectedTokens([]);
    }
  }, [editingTask, isOpen]);

  // Live real-time calculated score
  const liveScore = computePriority({
    deadline,
    importance,
    difficulty,
    estimatedTime,
  });
  const liveLevel = priorityLevel(liveScore);
  const liveTheme = PRIORITY_THEMES[liveLevel];

  // NLP Live Extraction
  const handleNlpChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNlpPrompt(val);
    if (val.trim()) {
      const parsed = parseNaturalLanguage(val);
      setDetectedTokens(parsed.detectedTokens);
      setTitle(parsed.title);
      setDescription(parsed.description);
      setCategory(parsed.category);
      setDeadline(parsed.deadline);
      setImportance(parsed.importance);
      setDifficulty(parsed.difficulty);
      setEstimatedTime(parsed.estimatedTime);
    }
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    sounds.playPop();
    const d = new Date();
    d.setDate(d.getDate() + preset.inDays);
    setTitle(preset.title);
    setCategory(preset.cat as Category);
    setImportance(preset.imp);
    setDifficulty(preset.diff);
    setEstimatedTime(preset.time);
    setDeadline(d.toISOString().slice(0, 10));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    sounds.playPop();
    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      deadline,
      importance,
      difficulty,
      estimatedTime,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative w-full max-w-2xl bg-white/95 dark:bg-[#0D0E14]/95 backdrop-blur-xl border border-neutral-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 my-auto"
          >
            {/* Top Accent Gradient Bar */}
            <div className={`h-1.5 w-full bg-gradient-to-r ${liveTheme.gradient}`} />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 dark:border-white/10">
              <div>
                <div className="text-[9px] uppercase tracking-[0.25em] font-bold text-rose-500 font-mono">
                  {editingTask ? 'EDIT ENTRY' : 'TASK PROTOCOL'}
                </div>
                <h2 className="text-xl font-light italic font-editorial-serif text-neutral-900 dark:text-white flex items-center gap-2">
                  <span>{editingTask ? 'Edit Task' : 'Register New Task'}</span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${liveTheme.bgSoft}`}>
                    {liveTheme.flameEmoji} {liveTheme.badge} ({liveScore})
                  </span>
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-light">
                  Our algorithmic weighting system computes priority dynamics in real-time.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Mode Tabs (only when adding new task) */}
            {!editingTask && (
              <div className="px-6 pt-4 pb-2">
                <div className="grid grid-cols-2 p-1 bg-neutral-100 dark:bg-white/[0.05] rounded-xl border border-neutral-200/60 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setTab('form');
                    }}
                    className={`flex items-center justify-center gap-2 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all ${
                      tab === 'form'
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-sm'
                        : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Visual Simulator</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setTab('nlp');
                    }}
                    className={`flex items-center justify-center gap-2 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all ${
                      tab === 'nlp'
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-sm'
                        : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    <Wand2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>Natural Language (AI)</span>
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-5 max-h-[62vh] overflow-y-auto">
                {/* NLP Magic Prompt Input */}
                {tab === 'nlp' && !editingTask && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-neutral-100/90 dark:bg-[#090A0F]/90 border border-neutral-200 dark:border-white/10 space-y-3"
                  >
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Type naturally — our parser extracts category, deadline & urgency:
                    </label>
                    <textarea
                      rows={3}
                      value={nlpPrompt}
                      onChange={handleNlpChange}
                      placeholder="e.g. I have to finish my Machine Learning thesis by Friday and it is very important, will take about 4 hours"
                      className="w-full text-sm p-3 rounded-lg bg-white dark:bg-[#12131C] border border-neutral-200 dark:border-white/10 focus:ring-2 focus:ring-rose-500 focus:outline-none placeholder-neutral-400 font-light"
                    />

                    {/* Detected Tokens Chip Bar */}
                    {detectedTokens.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Extracted:</span>
                        {detectedTokens.map((t, idx) => (
                          <motion.span
                            key={idx}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold bg-white dark:bg-[#12131C] border border-neutral-200 dark:border-white/10 px-2 py-0.5 rounded text-neutral-800 dark:text-neutral-200"
                          >
                            <span className="text-rose-500 uppercase">{t.type}:</span> {t.value}
                          </motion.span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Quick Presets */}
                {!editingTask && (
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-neutral-400 block mb-2">
                      Quick Presets:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESETS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => applyPreset(p)}
                          className="text-xs font-mono bg-white dark:bg-white/[0.05] hover:border-rose-500 border border-neutral-200 dark:border-white/10 px-2.5 py-1 rounded-lg transition-all text-neutral-700 dark:text-neutral-300"
                        >
                          + {p.title.slice(0, 26)}…
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Title */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Complete Database Management assignment"
                    className="w-full text-sm px-4 py-2.5 rounded-xl bg-white dark:bg-[#090A0F] border border-neutral-200 dark:border-white/10 focus:ring-2 focus:ring-rose-500 focus:outline-none text-neutral-900 dark:text-white font-medium"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Description / Key Steps (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Notes, subtasks, or reference links..."
                    className="w-full text-sm px-4 py-2 rounded-xl bg-white dark:bg-[#090A0F] border border-neutral-200 dark:border-white/10 focus:ring-2 focus:ring-rose-500 focus:outline-none text-neutral-900 dark:text-white font-light"
                  />
                </div>

                {/* Category & Deadline Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-rose-500" /> Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as Category)}
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#090A0F] border border-neutral-200 dark:border-white/10 focus:ring-2 focus:ring-rose-500 focus:outline-none text-neutral-900 dark:text-white font-medium"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat} className="dark:bg-[#0D0E14]">
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-rose-500" /> Deadline Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full text-sm px-3.5 py-2 rounded-xl bg-white dark:bg-[#090A0F] border border-neutral-200 dark:border-white/10 focus:ring-2 focus:ring-rose-500 focus:outline-none text-neutral-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                {/* Interactive Dynamic Sliders with Live Dial Preview */}
                <div className="p-4 rounded-xl bg-neutral-100/90 dark:bg-[#090A0F]/90 border border-neutral-200/80 dark:border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-rose-500" /> Priority Drivers & Weightings
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-neutral-400">Preview:</span>
                      <AnimatedPriorityDial
                        score={liveScore}
                        size="xs"
                        interactive={false}
                        taskData={{ deadline, importance, difficulty, estimatedTime }}
                      />
                    </div>
                  </div>

                  {/* Importance Slider (30% weight) */}
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">
                        ⭐ Importance (30% weight)
                      </span>
                      <span className="font-mono font-bold text-amber-500">{importance}/10</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={importance}
                      onChange={(e) => setImportance(parseInt(e.target.value, 10))}
                      className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-neutral-400 mt-0.5">
                      <span>Low impact</span>
                      <span>High Strategic Value</span>
                    </div>
                  </div>

                  {/* Difficulty Slider (15% weight) */}
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">
                        ⚡ Complexity / Difficulty (15% weight)
                      </span>
                      <span className="font-mono font-bold text-blue-500">{difficulty}/10</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={difficulty}
                      onChange={(e) => setDifficulty(parseInt(e.target.value, 10))}
                      className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-neutral-400 mt-0.5">
                      <span>Straightforward</span>
                      <span>Deep Cognitive Focus</span>
                    </div>
                  </div>

                  {/* Estimated Hours Slider (15% weight) */}
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">
                        ⏱️ Estimated Commitment (15% weight)
                      </span>
                      <span className="font-mono font-bold text-emerald-500">{estimatedTime} hours</span>
                    </div>
                    <input
                      type="range"
                      min={0.5}
                      max={10}
                      step={0.5}
                      value={estimatedTime}
                      onChange={(e) => setEstimatedTime(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-neutral-400 mt-0.5">
                      <span>30 mins</span>
                      <span>10+ hours</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-100 dark:border-white/10 bg-neutral-50/50 dark:bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2.5 h-2.5 rounded-full animate-pulse`}
                    style={{ backgroundColor: liveTheme.color }}
                  />
                  <span className="text-xs font-mono font-bold" style={{ color: liveTheme.color }}>
                    Score: {liveScore}/100 ({liveTheme.label})
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    Cancel
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    type="submit"
                    className="px-5 py-2 text-xs font-mono font-bold uppercase tracking-wider text-white rounded-lg shadow-lg bg-neutral-900 dark:bg-white dark:text-black hover:opacity-90 transition-opacity flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingTask ? 'Save Changes' : 'Create Task'}</span>
                  </motion.button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
