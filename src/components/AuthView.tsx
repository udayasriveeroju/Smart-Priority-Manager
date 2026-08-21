import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck, Check, Layers, Zap, Bot, Flame } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface AuthViewProps {
  onLogin: (name: string, email: string) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('Jordan Lee');
  const [email, setEmail] = useState('jordan@example.com');
  const [password, setPassword] = useState('••••••••');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    sounds.playComplete();
    onLogin(isRegister ? name.trim() || 'Jordan Lee' : 'Jordan Lee', email.trim());
  };

  const handleDemoLogin = () => {
    sounds.playComplete();
    onLogin('Jordan Lee', 'demo@priorly.app');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-[#080808] text-white select-none">
      {/* Editorial Mesh & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-10 left-10 w-96 h-96 bg-rose-500/20 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-10 right-10 w-[420px] h-[420px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none"
      />

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Brand Logo & Tagline */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white text-black shadow-2xl mb-1">
            <Flame className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="text-[9px] uppercase tracking-[0.3em] font-bold text-rose-500 font-mono">
            VOLUME 01 • ISSUE 2026
          </div>
          <h1 className="text-3xl sm:text-4xl font-light italic font-editorial-serif tracking-tight text-white">
            Smart Priority Manager
          </h1>
          <p className="text-xs text-neutral-400 font-light max-w-xs mx-auto">
            Deterministic prioritization heuristics and intelligent task telemetry designed with editorial discipline.
          </p>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="rounded-2xl bg-[#0D0E14]/90 border border-white/10 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl space-y-6"
        >
          {/* Tab Switcher */}
          <div className="grid grid-cols-2 p-1 bg-white/[0.04] border border-white/10 rounded-xl">
            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                setIsRegister(false);
                setError('');
              }}
              className={`py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                !isRegister ? 'bg-white text-black shadow-md' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                setIsRegister(true);
                setError('');
              }}
              className={`py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                isRegister ? 'bg-white text-black shadow-md' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Lee"
                  className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:ring-2 focus:ring-rose-500 focus:outline-none text-white placeholder-neutral-500 font-medium"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:ring-2 focus:ring-rose-500 focus:outline-none text-white placeholder-neutral-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:ring-2 focus:ring-rose-500 focus:outline-none text-white placeholder-neutral-500 font-mono"
              />
            </div>

            {error && (
              <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/30 p-2.5 rounded-lg font-mono font-medium">
                {error}
              </p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 rounded-xl bg-white text-black hover:bg-neutral-200 font-mono font-bold uppercase tracking-wider text-xs shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <span>{isRegister ? 'Create Editorial Account' : 'Sign In to Workspace'}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>

          {/* Quick 1-Click Demo Launcher */}
          <div className="pt-2 border-t border-white/10 text-center space-y-2">
            <button
              onClick={handleDemoLogin}
              className="w-full py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-neutral-200 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-white/10 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>Instant Demo Access</span>
            </button>
            <p className="text-[11px] text-neutral-500 font-mono">
              Pre-loaded with sample editorial tasks, calculated priorities, and metrics.
            </p>
          </div>
        </motion.div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono text-neutral-400">
          <div className="p-2 rounded-xl bg-white/[0.02] border border-white/10">
            <span className="text-rose-400 font-bold block uppercase">Algorithm</span>
            <span>Multi-factor</span>
          </div>
          <div className="p-2 rounded-xl bg-white/[0.02] border border-white/10">
            <span className="text-neutral-200 font-bold block uppercase">AI Parser</span>
            <span>Natural language</span>
          </div>
          <div className="p-2 rounded-xl bg-white/[0.02] border border-white/10">
            <span className="text-emerald-400 font-bold block uppercase">Deep Focus</span>
            <span>Cadence timer</span>
          </div>
        </div>
      </div>
    </div>
  );
};
