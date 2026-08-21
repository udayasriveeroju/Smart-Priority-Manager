import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Send, Sparkles, Flame, CheckCircle, Clock, Zap, ArrowRight, User as UserIcon } from 'lucide-react';
import { AIMessage, Task } from '../../types';
import { answerAIQuery, getSmartRecommendations, refreshTask } from '../../utils/priorityEngine';
import { sounds } from '../../utils/soundEffects';

interface AIViewProps {
  tasks: Task[];
  onStartFocus: (task: Task) => void;
  onToggleTask: (id: string) => void;
}

const QUICK_PROMPTS = [
  'Which task should I start with right now?',
  'What is currently overdue or due today?',
  'Give me quick wins under 1 hour',
  'What can I safely postpone or defer?',
  'Plan today’s recommended Focus Trio',
];

export const AIView: React.FC<AIViewProps> = ({
  tasks,
  onStartFocus,
  onToggleTask,
}) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize with an insightful welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const recs = getSmartRecommendations(tasks);
      const initialText = `👋 Hello! I am your **Priorly AI Priority Strategist**.\n\nI evaluate your tasks through our multi-variable priority formula (Deadlines 40%, Importance 30%, Complexity 15%, Time commitment 15%).\n\n**Current Live Insights:**\n\n${recs.insights.join('\n\n')}\n\n*How would you like to optimize your schedule today?*`;

      setMessages([
        {
          id: 'welcome',
          role: 'ai',
          text: initialText,
          timestamp: Date.now(),
          suggestions: [
            'Which task should I do first?',
            'Show quick wins',
            'What is overdue?',
          ],
        },
      ]);
    }
  }, [tasks]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    sounds.playPop();

    const userMsg: AIMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    // Simulate fast intelligent processing
    setTimeout(() => {
      const response = answerAIQuery(query, tasks);
      const aiMsg: AIMessage = {
        id: `ai-${Date.now()}`,
        role: 'ai',
        text: response.text,
        timestamp: Date.now(),
        actionableTasks: response.actionableTasks,
        suggestions: response.suggestions,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      sounds.playPop();
    }, 450);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black flex items-center justify-center shadow-lg">
            <Bot className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-[0.25em] font-bold text-rose-500 font-mono">
              ALGORITHMIC INTELLIGENCE
            </div>
            <h1 className="text-2xl font-light italic font-editorial-serif tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
              <span>Editorial AI Strategist</span>
              <span className="text-[10px] uppercase font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                Live Analysis
              </span>
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Deterministic priority planner and workload optimization strategist.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Questions Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {QUICK_PROMPTS.map((prompt, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSend(prompt)}
            className="flex-shrink-0 text-xs font-mono font-medium px-3.5 py-2 rounded-xl bg-white/90 dark:bg-[#0D0E14]/90 border border-neutral-200/80 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:border-neutral-900 dark:hover:border-white shadow-sm transition-all"
          >
            {prompt}
          </motion.button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white/90 dark:bg-[#0D0E14]/90 border border-neutral-200/80 dark:border-white/10 shadow-sm min-h-[480px] max-h-[600px] overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'ai' && (
              <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-black flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-xl rounded-xl p-4 text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-black font-medium shadow-md'
                  : 'bg-neutral-100/90 dark:bg-[#090A0F]/90 text-neutral-800 dark:text-neutral-200 border border-neutral-200/60 dark:border-white/10'
              }`}
            >
              {/* Message Content with simple bold rendering */}
              <div className="whitespace-pre-wrap space-y-2">
                {msg.text.split('\n').map((line, i) => {
                  const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g);
                  return (
                    <p key={i}>
                      {parts.map((part, pIdx) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={pIdx} className="font-bold text-rose-500 dark:text-rose-400 font-mono">{part.slice(2, -2)}</strong>;
                        }
                        if (part.startsWith('*') && part.endsWith('*')) {
                          return <em key={pIdx} className="italic text-neutral-500 dark:text-neutral-400 font-editorial-serif">{part.slice(1, -1)}</em>;
                        }
                        return part;
                      })}
                    </p>
                  );
                })}
              </div>

              {/* Actionable task buttons attached to message */}
              {msg.actionableTasks && msg.actionableTasks.length > 0 && (
                <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-white/10 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-500 block font-mono">
                    Referenced Tasks:
                  </span>
                  {msg.actionableTasks.map((tId) => {
                    const task = tasks.find((t) => t.id === tId);
                    if (!task) return null;
                    return (
                      <div
                        key={tId}
                        className="p-2.5 rounded-lg bg-white dark:bg-[#12131C] border border-neutral-200 dark:border-white/10 flex items-center justify-between gap-2"
                      >
                        <span className="truncate font-semibold text-xs text-neutral-900 dark:text-white">
                          {task.title}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              sounds.playWhoosh();
                              onStartFocus(task);
                            }}
                            className="px-2.5 py-1 rounded bg-neutral-900 text-white dark:bg-white dark:text-black text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 font-mono"
                          >
                            <span>Focus</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Suggestion Chips */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-neutral-200/60 dark:border-white/10 flex flex-wrap gap-1.5">
                  {msg.suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(s)}
                      className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded bg-white dark:bg-[#12131C] text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-white/10 hover:border-rose-500 dark:hover:border-rose-500 transition-colors"
                    >
                      → {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-neutral-200 dark:bg-white/10 flex items-center justify-center text-neutral-700 dark:text-neutral-200 flex-shrink-0 mt-1">
                <UserIcon className="w-4 h-4" />
              </div>
            )}
          </motion.div>
        ))}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-black flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 rounded-xl bg-neutral-100 dark:bg-white/[0.05] text-neutral-500 text-xs font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>Analyzing schedule & computing strategic priorities...</span>
            </div>
          </motion.div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Row */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="relative flex items-center gap-2"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask Smart Priority Manager anything about your workload, schedule, or priority ranking..."
          className="flex-1 text-xs sm:text-sm px-5 py-3.5 rounded-xl bg-white/90 dark:bg-[#0D0E14]/90 border border-neutral-200/80 dark:border-white/10 focus:ring-2 focus:ring-rose-500 focus:outline-none text-neutral-900 dark:text-white shadow-sm font-medium placeholder:text-neutral-400"
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={!inputQuery.trim()}
          className="p-3.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black disabled:opacity-40 shadow-lg transition-all"
        >
          <Send className="w-4 h-4" />
        </motion.button>
      </form>
    </div>
  );
};
