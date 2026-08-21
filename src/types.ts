export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';

export type Category = 
  | 'Education' 
  | 'Work' 
  | 'Personal' 
  | 'Health' 
  | 'Finance' 
  | 'Home' 
  | 'Creative' 
  | 'Tech'
  | 'Errands';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: Category;
  deadline: string; // YYYY-MM-DD
  importance: number; // 1 - 10
  difficulty: number; // 1 - 10
  estimatedTime: number; // in hours (e.g. 0.5, 1, 2.5)
  completed: boolean;
  createdAt: number;
  updatedAt: number;
  completedAt: number | null;
  priorityScore: number; // 0 - 100
  priorityLevel: PriorityLevel;
  tags?: string[];
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarColor?: string;
  soundEnabled?: boolean;
  theme?: ThemeMode;
}

export type ThemeMode = 'editorial-dark' | 'editorial-light' | 'aurora-dark' | 'clean-light' | 'cyber-neon' | 'sunset-glow' | 'emerald-zen';

export interface AIMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: number;
  highlightedTasks?: string[];
  actionableTasks?: string[];
  suggestions?: string[];
}

export interface PriorityBreakdown {
  score: number;
  level: PriorityLevel;
  deadlineWeight: number;
  importanceWeight: number;
  difficultyWeight: number;
  timeUrgencyWeight: number;
  daysRemaining: number;
}
