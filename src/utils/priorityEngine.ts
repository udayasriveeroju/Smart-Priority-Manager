import { Category, PriorityBreakdown, PriorityLevel, Task } from '../types';

export function daysUntil(deadline: string): number {
  if (!deadline) return 3;
  const target = new Date(deadline + 'T23:59:59').getTime();
  const now = new Date().getTime();
  return (target - now) / (1000 * 60 * 60 * 24);
}

export function deadlineScore(deadline: string): number {
  const days = daysUntil(deadline);
  if (days <= 0) return 100; // Overdue or today
  if (days <= 1) return 92;
  if (days <= 2) return 82;
  if (days <= 3) return 72;
  if (days <= 5) return 58;
  if (days <= 7) return 45;
  if (days <= 14) return 28;
  return 14;
}

export function computePriority(task: {
  deadline: string;
  importance: number;
  difficulty: number;
  estimatedTime: number;
}): number {
  const dScore = deadlineScore(task.deadline);
  const iScore = Math.min(10, Math.max(1, task.importance)) * 10;
  const diffScore = Math.min(10, Math.max(1, task.difficulty)) * 10;
  const tScore = Math.min(100, Math.max(0.25, task.estimatedTime) * 8);

  // Weights: Deadline 40%, Importance 30%, Difficulty 15%, Time requirement 15%
  const score = dScore * 0.4 + iScore * 0.3 + diffScore * 0.15 + tScore * 0.15;
  return Math.round(Math.min(100, Math.max(0, score)));
}

export function getPriorityBreakdown(task: {
  deadline: string;
  importance: number;
  difficulty: number;
  estimatedTime: number;
}): PriorityBreakdown {
  const dScore = deadlineScore(task.deadline);
  const iScore = Math.min(10, Math.max(1, task.importance)) * 10;
  const diffScore = Math.min(10, Math.max(1, task.difficulty)) * 10;
  const tScore = Math.min(100, Math.max(0.25, task.estimatedTime) * 8);

  const deadlineWeight = Math.round(dScore * 0.4);
  const importanceWeight = Math.round(iScore * 0.3);
  const difficultyWeight = Math.round(diffScore * 0.15);
  const timeUrgencyWeight = Math.round(tScore * 0.15);
  const score = Math.min(100, Math.max(0, deadlineWeight + importanceWeight + difficultyWeight + timeUrgencyWeight));

  return {
    score,
    level: priorityLevel(score),
    deadlineWeight,
    importanceWeight,
    difficultyWeight,
    timeUrgencyWeight,
    daysRemaining: Math.round(daysUntil(task.deadline) * 10) / 10,
  };
}

export function priorityLevel(score: number): PriorityLevel {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

export interface PriorityTheme {
  label: string;
  badge: string;
  color: string;
  gradient: string;
  bgSoft: string;
  borderGlow: string;
  textGlow: string;
  flameEmoji: string;
}

export const PRIORITY_THEMES: Record<PriorityLevel, PriorityTheme> = {
  critical: {
    label: 'Critical Priority',
    badge: 'Critical',
    color: '#FF3366',
    gradient: 'from-rose-500 via-red-500 to-pink-600',
    bgSoft: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    borderGlow: 'shadow-[0_0_20px_rgba(255,51,102,0.35)] ring-1 ring-rose-500/50',
    textGlow: 'text-rose-400 drop-shadow-[0_0_8px_rgba(255,51,102,0.5)]',
    flameEmoji: '🔥',
  },
  high: {
    label: 'High Priority',
    badge: 'High',
    color: '#F59E0B',
    gradient: 'from-amber-400 via-orange-500 to-amber-600',
    bgSoft: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    borderGlow: 'shadow-[0_0_18px_rgba(245,158,11,0.25)] ring-1 ring-amber-500/40',
    textGlow: 'text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]',
    flameEmoji: '⚡',
  },
  medium: {
    label: 'Medium Priority',
    badge: 'Medium',
    color: '#3B82F6',
    gradient: 'from-blue-400 via-cyan-500 to-indigo-500',
    bgSoft: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    borderGlow: 'shadow-[0_0_16px_rgba(59,130,246,0.2)] ring-1 ring-blue-500/30',
    textGlow: 'text-blue-400 drop-shadow-[0_0_6px_rgba(59,130,246,0.3)]',
    flameEmoji: '🎯',
  },
  low: {
    label: 'Low Priority',
    badge: 'Low',
    color: '#10B981',
    gradient: 'from-emerald-400 via-teal-500 to-green-600',
    bgSoft: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    borderGlow: 'shadow-[0_0_14px_rgba(16,185,129,0.18)] ring-1 ring-emerald-500/25',
    textGlow: 'text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.3)]',
    flameEmoji: '🌱',
  },
};

export const CATEGORY_COLORS: Record<Category, { bg: string; text: string; iconColor: string }> = {
  Education: { bg: 'bg-indigo-500/15', text: 'text-indigo-400 border-indigo-500/30', iconColor: '#818CF8' },
  Work: { bg: 'bg-blue-500/15', text: 'text-blue-400 border-blue-500/30', iconColor: '#60A5FA' },
  Personal: { bg: 'bg-purple-500/15', text: 'text-purple-400 border-purple-500/30', iconColor: '#C084FC' },
  Health: { bg: 'bg-emerald-500/15', text: 'text-emerald-400 border-emerald-500/30', iconColor: '#34D399' },
  Finance: { bg: 'bg-amber-500/15', text: 'text-amber-400 border-amber-500/30', iconColor: '#FBBF24' },
  Home: { bg: 'bg-teal-500/15', text: 'text-teal-400 border-teal-500/30', iconColor: '#2DD4BF' },
  Creative: { bg: 'bg-fuchsia-500/15', text: 'text-fuchsia-400 border-fuchsia-500/30', iconColor: '#E879F9' },
  Tech: { bg: 'bg-cyan-500/15', text: 'text-cyan-400 border-cyan-500/30', iconColor: '#22D3EE' },
  Errands: { bg: 'bg-orange-500/15', text: 'text-orange-400 border-orange-500/30', iconColor: '#FB923C' },
};

export function isOverdue(task: Task): boolean {
  return !task.completed && daysUntil(task.deadline) < 0;
}

export function refreshTask<T extends { deadline: string; importance: number; difficulty: number; estimatedTime: number }>(t: T): T & { priorityScore: number; priorityLevel: PriorityLevel } {
  const priorityScore = computePriority(t);
  const pLevel = priorityLevel(priorityScore);
  return {
    ...t,
    priorityScore,
    priorityLevel: pLevel,
  };
}

export function formatDeadlineText(deadline: string): { text: string; isUrgent: boolean; isPast: boolean } {
  const days = Math.ceil(daysUntil(deadline));
  if (days < 0) {
    const d = Math.abs(days);
    return { text: `Overdue by ${d} day${d === 1 ? '' : 's'}`, isUrgent: true, isPast: true };
  }
  if (days === 0) {
    return { text: 'Due Today', isUrgent: true, isPast: false };
  }
  if (days === 1) {
    return { text: 'Due Tomorrow', isUrgent: true, isPast: false };
  }
  return { text: `In ${days} days`, isUrgent: days <= 2, isPast: false };
}

// Natural Language Parser
export function parseNaturalLanguage(raw: string): {
  title: string;
  description: string;
  category: Category;
  deadline: string;
  importance: number;
  difficulty: number;
  estimatedTime: number;
  detectedTokens: { type: string; value: string }[];
} {
  const text = raw.trim();
  const today = new Date();
  const detectedTokens: { type: string; value: string }[] = [];

  // Importance
  let importance = 5;
  if (/\b(very important|extremely important|critical|top priority|urgent|high priority|highest priority)\b/i.test(text)) {
    importance = 9;
    detectedTokens.push({ type: 'Urgency', value: 'High/Critical (9/10)' });
  } else if (/\b(important|crucial|needed)\b/i.test(text)) {
    importance = 7;
    detectedTokens.push({ type: 'Urgency', value: 'Important (7/10)' });
  } else if (/\b(minor|low priority|whenever|not urgent|casual)\b/i.test(text)) {
    importance = 3;
    detectedTokens.push({ type: 'Urgency', value: 'Low priority (3/10)' });
  }

  // Deadline
  let deadline: string | null = null;
  const toDateStr = (d: Date) => d.toISOString().slice(0, 10);

  if (/\btoday\b/i.test(text)) {
    deadline = toDateStr(today);
    detectedTokens.push({ type: 'Deadline', value: 'Today' });
  } else if (/\btomorrow\b/i.test(text)) {
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    deadline = toDateStr(d);
    detectedTokens.push({ type: 'Deadline', value: 'Tomorrow' });
  } else if (/\bnext week\b/i.test(text)) {
    const d = new Date(today);
    d.setDate(d.getDate() + 7);
    deadline = toDateStr(d);
    detectedTokens.push({ type: 'Deadline', value: 'Next week (+7d)' });
  } else {
    const inDaysMatch = text.match(/in\s+(\d+)\s+days?/i);
    if (inDaysMatch) {
      const d = new Date(today);
      const count = parseInt(inDaysMatch[1], 10);
      d.setDate(d.getDate() + count);
      deadline = toDateStr(d);
      detectedTokens.push({ type: 'Deadline', value: `In ${count} days` });
    } else {
      const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayMatch = text.match(/\b(next\s+)?(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/i);
      if (dayMatch) {
        const target = weekdays.indexOf(dayMatch[2].toLowerCase());
        const d = new Date(today);
        let diff = (target - d.getDay() + 7) % 7;
        if (diff === 0) diff = 7;
        d.setDate(d.getDate() + diff);
        deadline = toDateStr(d);
        detectedTokens.push({ type: 'Deadline', value: dayMatch[0] });
      } else {
        const dateMatch = text.match(/\b(\d{4}-\d{2}-\d{2})\b/);
        if (dateMatch) {
          deadline = dateMatch[1];
          detectedTokens.push({ type: 'Deadline', value: deadline });
        }
      }
    }
  }

  if (!deadline) {
    const d = new Date(today);
    d.setDate(d.getDate() + 3);
    deadline = toDateStr(d);
  }

  // Category
  let category: Category = 'Education';
  const catRegex: Record<Category, RegExp> = {
    Education: /\b(study|homework|assignment|exam|quiz|lecture|class|course|thesis|seminar|submit|lab|notes)\b/i,
    Work: /\b(meeting|client|report|presentation|deploy|review|sprint|standup|boss|colleague|project)\b/i,
    Tech: /\b(code|bug|api|database|refactor|git|server|frontend|backend|app|docker)\b/i,
    Health: /\b(gym|workout|run|doctor|dentist|medicine|meditation|sleep|walk|fitness)\b/i,
    Finance: /\b(pay|bill|invoice|tax|budget|bank|transfer|salary|crypto|invest)\b/i,
    Home: /\b(clean|laundry|dishes|cook|repair|groceries|organize|plants)\b/i,
    Creative: /\b(draw|write|video|design|music|photo|blog|sketch|record)\b/i,
    Errands: /\b(buy|pickup|deliver|post office|store|shop|car wash)\b/i,
    Personal: /\b(call|birthday|gift|family|friend|trip|vacation|read)\b/i,
  };

  for (const [cat, regex] of Object.entries(catRegex)) {
    if (regex.test(text)) {
      category = cat as Category;
      detectedTokens.push({ type: 'Category', value: cat });
      break;
    }
  }

  // Difficulty
  let difficulty = 5;
  if (/\b(complex|hard|difficult|challenging|heavy|intense)\b/i.test(text)) {
    difficulty = 8;
    detectedTokens.push({ type: 'Difficulty', value: 'High (8/10)' });
  } else if (/\b(easy|simple|quick|effortless|breeze)\b/i.test(text)) {
    difficulty = 3;
    detectedTokens.push({ type: 'Difficulty', value: 'Easy (3/10)' });
  }

  // Estimated hours
  let estimatedTime = 2;
  const timeMatch = text.match(/(\d+(\.\d+)?)\s*(hours?|hrs?|h)\b/i);
  if (timeMatch) {
    estimatedTime = parseFloat(timeMatch[1]);
    detectedTokens.push({ type: 'Time', value: `${estimatedTime}h` });
  } else if (/\b(quick|15 mins?|30 mins?|quick task)\b/i.test(text)) {
    estimatedTime = 0.5;
    detectedTokens.push({ type: 'Time', value: '0.5h' });
  } else if (difficulty >= 8) {
    estimatedTime = 3.5;
  }

  // Clean title
  let title = text
    .replace(/^i\s+(need|have|want|must|should|got)\s+to\s+/i, '')
    .replace(/^(please\s+)?(remind me to|don't forget to|remember to|make sure to)\s+/i, '')
    .replace(/\b(tomorrow|today|next week|in\s+\d+\s+days?|next\s+(sunday|monday|tuesday|wednesday|thursday|friday|saturday))\b/gi, '')
    .replace(/\b(and\s+it\s+is\s+)?(very\s+)?(important|urgent|critical|minor|not urgent|hard|difficult|simple|easy)\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/[.,;]+$/, '')
    .trim();

  if (!title) title = text.slice(0, 40);
  title = title.charAt(0).toUpperCase() + title.slice(1);

  return {
    title,
    description: text,
    category,
    deadline,
    importance,
    difficulty,
    estimatedTime,
    detectedTokens,
  };
}

// AI Assistant reasoning engine
export function getSmartRecommendations(tasks: Task[]): {
  topTask: Task | null;
  overdue: Task[];
  urgent: Task[];
  quickWins: Task[];
  postponable: Task[];
  focusTrio: Task[];
  insights: string[];
} {
  const active = tasks.filter((t) => !t.completed).map(refreshTask).sort((a, b) => b.priorityScore - a.priorityScore);
  const overdue = active.filter(isOverdue);
  const urgent = active.filter((t) => !isOverdue(t) && daysUntil(t.deadline) <= 2);
  const quickWins = active.filter((t) => t.estimatedTime <= 1 && t.priorityScore >= 50);
  const postponable = active.filter((t) => t.priorityScore < 40 && daysUntil(t.deadline) > 5);
  const focusTrio = active.slice(0, 3);

  const insights: string[] = [];

  if (active.length === 0) {
    insights.push('🎉 All caught up! No pending tasks right now.');
  } else {
    if (active[0]) {
      const top = active[0];
      insights.push(`🎯 **#1 Priority**: "${top.title}" scoring **${top.priorityScore}/100** (${top.priorityLevel.toUpperCase()}). Due in ${Math.ceil(daysUntil(top.deadline))}d.`);
    }
    if (overdue.length > 0) {
      insights.push(`⚠️ **${overdue.length} Overdue**: Complete "${overdue[0].title}" first to avoid schedule bottlenecks.`);
    }
    if (quickWins.length > 0) {
      insights.push(`⚡ **Quick Win**: "${quickWins[0].title}" takes only ${quickWins[0].estimatedTime}h and will boost momentum.`);
    }
    if (postponable.length > 0) {
      insights.push(`🌱 **Safe to Defer**: "${postponable[0].title}" can wait until higher-urgency items are finished.`);
    }
  }

  return {
    topTask: active[0] || null,
    overdue,
    urgent,
    quickWins,
    postponable,
    focusTrio,
    insights,
  };
}

export function answerAIQuery(query: string, tasks: Task[]): { text: string; actionableTasks?: string[]; suggestions?: string[] } {
  const q = query.toLowerCase();
  const active = tasks.filter((t) => !t.completed).map(refreshTask).sort((a, b) => b.priorityScore - a.priorityScore);
  const overdue = active.filter(isOverdue);

  if (active.length === 0) {
    return {
      text: "You have zero pending tasks! Great time to relax or brainstorm future goals. 🌟",
      suggestions: ["How do I plan next week?", "Review past completed tasks"],
    };
  }

  if (/first|start|begin|next/i.test(q)) {
    const top = active[0];
    return {
      text: `You should begin with **${top.title}**!\n\n• **Priority Score**: ${top.priorityScore}/100 (${top.priorityLevel.toUpperCase()})\n• **Deadline**: ${formatDeadlineText(top.deadline).text}\n• **Category**: ${top.category}\n• **Estimated Time**: ${top.estimatedTime} hours\n\n*Reasoning:* It has the highest combined score based on urgency (40%), importance (30%), difficulty (15%), and required time commitment (15%).`,
      actionableTasks: [top.id],
      suggestions: ["Start Pomodoro timer for this task", "What should I do after this?", "Show quick wins"],
    };
  }

  if (/overdue/i.test(q)) {
    if (overdue.length === 0) {
      return {
        text: "Great news! You have **0 overdue tasks**. Your schedule is healthy and up-to-date. ✨",
        suggestions: ["What's due next?", "Show high priority items"],
      };
    }
    return {
      text: `You have **${overdue.length} overdue task${overdue.length > 1 ? 's' : ''}** that require immediate recovery:\n\n${overdue.map((t, i) => `${i + 1}. **${t.title}** (${formatDeadlineText(t.deadline).text}) — ${t.category}`).join('\n')}`,
      actionableTasks: overdue.map((t) => t.id),
      suggestions: ["Help me reschedule overdue tasks", "What should I tackle first?"],
    };
  }

  if (/quick win|easy|fast|1 hour/i.test(q)) {
    const quick = active.filter((t) => t.estimatedTime <= 1);
    if (quick.length === 0) {
      return {
        text: "You don't have tasks marked under 1 hour. All your current tasks are larger assignments.",
        suggestions: ["Break down a large task", "Show top priority task"],
      };
    }
    return {
      text: `Here are **${quick.length} Quick Win tasks** (≤ 1 hour) for rapid momentum:\n\n${quick.map((t, i) => `${i + 1}. **${t.title}** (~${t.estimatedTime}h) — Score: ${t.priorityScore}`).join('\n')}`,
      actionableTasks: quick.map((t) => t.id),
      suggestions: ["Start a 25m Focus sprint", "Show overall priority breakdown"],
    };
  }

  if (/postpone|defer|later|can wait/i.test(q)) {
    const low = active.filter((t) => t.priorityScore < 45 && daysUntil(t.deadline) > 4);
    if (low.length === 0) {
      return {
        text: "Almost all your current tasks have high urgency or importance. There are no obvious tasks safe to postpone right now.",
        suggestions: ["Which task is highest priority?", "How can I balance workload?"],
      };
    }
    return {
      text: `These tasks have low immediate urgency and can safely wait:\n\n${low.map((t, i) => `${i + 1}. **${t.title}** (Score: ${t.priorityScore}, Due in ${Math.ceil(daysUntil(t.deadline))} days)`).join('\n')}`,
      actionableTasks: low.map((t) => t.id),
      suggestions: ["Show today's top 3 tasks", "Plan my afternoon"],
    };
  }

  if (/today|focus|plan|trio/i.test(q)) {
    const top3 = active.slice(0, 3);
    return {
      text: `Here is your **Recommended Focus Trio for Today**:\n\n${top3.map((t, i) => `${i + 1}. **${t.title}** (${t.priorityScore}/100) — ${formatDeadlineText(t.deadline).text} [~${t.estimatedTime}h]`).join('\n')}\n\n*Total dedicated time needed:* ~${top3.reduce((acc, t) => acc + t.estimatedTime, 0)} hours.`,
      actionableTasks: top3.map((t) => t.id),
      suggestions: ["Start Pomodoro mode", "What can I do if I finish early?"],
    };
  }

  // Default smart summary
  const recs = getSmartRecommendations(tasks);
  return {
    text: `Here is your current priority executive summary:\n\n${recs.insights.join('\n\n')}`,
    actionableTasks: recs.focusTrio.map((t) => t.id),
    suggestions: ["Which task should I do first?", "Show quick wins", "What is overdue?"],
  };
}

// Eisenhower Quadrants
export function categorizeEisenhower(tasks: Task[]) {
  const active = tasks.filter((t) => !t.completed).map(refreshTask);
  return {
    // Urgent & Important: Do First
    doFirst: active.filter((t) => daysUntil(t.deadline) <= 3 && t.importance >= 6),
    // Not Urgent & Important: Schedule / Deep Work
    schedule: active.filter((t) => daysUntil(t.deadline) > 3 && t.importance >= 6),
    // Urgent & Not Important: Delegate / Quick Clear
    delegate: active.filter((t) => daysUntil(t.deadline) <= 3 && t.importance < 6),
    // Not Urgent & Not Important: Eliminate / Low
    eliminate: active.filter((t) => daysUntil(t.deadline) > 3 && t.importance < 6),
  };
}
