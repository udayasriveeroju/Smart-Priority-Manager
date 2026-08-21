import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Task, User, ThemeMode } from './types';
import { refreshTask } from './utils/priorityEngine';
import { sounds } from './utils/soundEffects';
import { AuthView } from './components/AuthView';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/Views/DashboardView';
import { TasksView } from './components/Views/TasksView';
import { FocusView } from './components/Views/FocusView';
import { MatrixView } from './components/Views/MatrixView';
import { AIView } from './components/Views/AIView';
import { AnalyticsView } from './components/Views/AnalyticsView';
import { SettingsView } from './components/Views/SettingsView';
import { AddTaskModal } from './components/AddTaskModal';
import { FocusPomodoroModal } from './components/FocusPomodoroModal';

// Default initial tasks
const getInitialSampleTasks = (userId: string): Task[] => {
  const today = new Date();
  const getOffsetDate = (days: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  };

  const initialList: Omit<Task, 'priorityScore' | 'priorityLevel'>[] = [
    {
      id: 'task-1',
      userId,
      title: 'Complete Database Management Assignment',
      description: 'Finish ER Diagram, Normalization exercises up to BCNF, and query optimization writeup',
      category: 'Education',
      deadline: getOffsetDate(1),
      importance: 9,
      difficulty: 7,
      estimatedTime: 4,
      completed: false,
      createdAt: Date.now() - 3600000 * 24,
      updatedAt: Date.now(),
      completedAt: null,
    },
    {
      id: 'task-2',
      userId,
      title: 'Prepare Java OOP Seminar Presentation',
      description: 'Create slide deck illustrating Polymorphism, Abstract classes, and Design Patterns',
      category: 'Education',
      deadline: getOffsetDate(2),
      importance: 8,
      difficulty: 5,
      estimatedTime: 3,
      completed: false,
      createdAt: Date.now() - 3600000 * 18,
      updatedAt: Date.now(),
      completedAt: null,
    },
    {
      id: 'task-3',
      userId,
      title: 'Fix Critical Production API Auth Bug',
      description: 'Resolve token expiration refresh race condition in auth middleware',
      category: 'Tech',
      deadline: getOffsetDate(0),
      importance: 9,
      difficulty: 8,
      estimatedTime: 2,
      completed: false,
      createdAt: Date.now() - 3600000 * 8,
      updatedAt: Date.now(),
      completedAt: null,
    },
    {
      id: 'task-4',
      userId,
      title: 'Revise Computer Networks (OSI vs TCP/IP)',
      description: 'Review Transport layer protocols, socket programming, and subnets for midterm',
      category: 'Education',
      deadline: getOffsetDate(4),
      importance: 7,
      difficulty: 4,
      estimatedTime: 2.5,
      completed: false,
      createdAt: Date.now() - 3600000 * 30,
      updatedAt: Date.now(),
      completedAt: null,
    },
    {
      id: 'task-5',
      userId,
      title: 'Pay Monthly Utilities & Electricity Bill',
      description: 'Review invoice and schedule payment via banking portal',
      category: 'Finance',
      deadline: getOffsetDate(-1), // Overdue to demonstrate alert
      importance: 6,
      difficulty: 1,
      estimatedTime: 0.5,
      completed: false,
      createdAt: Date.now() - 3600000 * 48,
      updatedAt: Date.now(),
      completedAt: null,
    },
    {
      id: 'task-6',
      userId,
      title: 'Morning 5km Cardio Run & Mobility Workout',
      description: 'High cadence interval training session at community park',
      category: 'Health',
      deadline: getOffsetDate(0),
      importance: 6,
      difficulty: 4,
      estimatedTime: 1,
      completed: true,
      createdAt: Date.now() - 3600000 * 12,
      updatedAt: Date.now(),
      completedAt: Date.now() - 3600000 * 4,
    },
    {
      id: 'task-7',
      userId,
      title: 'Weekly Grocery Restock',
      description: 'Fresh fruits, vegetables, oat milk, and pantry staples',
      category: 'Home',
      deadline: getOffsetDate(6),
      importance: 4,
      difficulty: 2,
      estimatedTime: 1.5,
      completed: false,
      createdAt: Date.now() - 3600000 * 20,
      updatedAt: Date.now(),
      completedAt: null,
    },
  ];

  return initialList.map(refreshTask);
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('priorly_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return {
      id: 'user-demo',
      name: 'Jordan Lee',
      email: 'jordan@priorly.app',
      theme: 'editorial-dark',
      soundEnabled: true,
    };
  });

  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (currentUser?.theme as ThemeMode) || 'editorial-dark';
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return currentUser?.soundEnabled ?? true;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [focusingTask, setFocusingTask] = useState<Task | null>(null);

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('priorly_tasks');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(refreshTask);
        }
      } catch {
        // Fallback
      }
    }
    return getInitialSampleTasks('user-demo');
  });

  // Save tasks to local storage
  useEffect(() => {
    localStorage.setItem('priorly_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Save user & theme to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('priorly_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  // Theme synchronization on document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(
      'theme-editorial-dark',
      'theme-editorial-light',
      'theme-clean-light',
      'theme-aurora-dark',
      'theme-cyber-neon',
      'theme-sunset-glow',
      'theme-emerald-zen',
      'dark'
    );

    if (theme === 'clean-light' || theme === 'editorial-light') {
      root.classList.add(`theme-${theme}`);
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.add(`theme-${theme}`);
    }
    sounds.enabled = soundEnabled;
  }, [theme, soundEnabled]);

  // Handlers
  const handleLogin = (name: string, email: string) => {
    const user: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      theme,
      soundEnabled,
    };
    setCurrentUser(user);
    const initial = getInitialSampleTasks(user.id);
    setTasks(initial);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('priorly_user');
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          return refreshTask({
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? Date.now() : null,
            updatedAt: Date.now(),
          });
        }
        return t;
      })
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSaveTask = (
    taskData: Omit<Task, 'id' | 'userId' | 'completed' | 'createdAt' | 'updatedAt' | 'completedAt' | 'priorityScore' | 'priorityLevel'>
  ) => {
    if (editingTask) {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === editingTask.id) {
            return refreshTask({
              ...t,
              ...taskData,
              updatedAt: Date.now(),
            });
          }
          return t;
        })
      );
      setEditingTask(null);
    } else {
      const newTask: Task = refreshTask({
        id: `task-${Date.now()}`,
        userId: currentUser?.id || 'demo',
        ...taskData,
        completed: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        completedAt: null,
      });
      setTasks((prev) => [newTask, ...prev]);
    }
  };

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    if (currentUser) {
      setCurrentUser({ ...currentUser, theme: newTheme });
    }
  };

  const handleToggleThemeQuick = () => {
    const themesList: ThemeMode[] = ['clean-light', 'aurora-dark', 'cyber-neon', 'sunset-glow', 'emerald-zen'];
    const currIdx = themesList.indexOf(theme);
    const nextTheme = themesList[(currIdx + 1) % themesList.length];
    handleThemeChange(nextTheme);
  };

  const handleToggleSound = () => {
    const nextSound = !soundEnabled;
    setSoundEnabled(nextSound);
    sounds.enabled = nextSound;
    if (currentUser) {
      setCurrentUser({ ...currentUser, soundEnabled: nextSound });
    }
  };

  const handleResetDemoData = () => {
    if (currentUser) {
      const demo = getInitialSampleTasks(currentUser.id);
      setTasks(demo);
      sounds.playComplete();
    }
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `priorly-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    sounds.playPop();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          setTasks(parsed.map(refreshTask));
          sounds.playComplete();
        }
      } catch {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  // If not logged in, render Auth screen
  if (!currentUser) {
    return <AuthView onLogin={handleLogin} />;
  }

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 relative overflow-x-hidden ${
      theme === 'editorial-dark'
        ? 'bg-[#080808] text-white'
        : theme === 'editorial-light'
        ? 'bg-[#F9F9F8] text-neutral-900'
        : theme === 'clean-light'
        ? 'bg-[#F8FAFC] text-slate-900'
        : theme === 'cyber-neon'
        ? 'bg-[#090A0F] text-slate-100'
        : theme === 'sunset-glow'
        ? 'bg-[#18101E] text-slate-100'
        : theme === 'emerald-zen'
        ? 'bg-[#0A1612] text-slate-100'
        : 'bg-[#0B0F19] text-slate-100'
    }`}>
      {/* Editorial Ambient Atmospheric Orbs */}
      {(theme === 'editorial-dark' || theme === 'aurora-dark' || theme === 'cyber-neon') && (
        <>
          <div className="fixed top-[-120px] right-[-100px] w-[540px] h-[540px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none z-0" />
          <div className="fixed bottom-[-140px] left-[-100px] w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-[160px] pointer-events-none z-0" />
          <div className="fixed top-1/2 left-1/3 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[130px] pointer-events-none z-0" />
          <div className="fixed inset-0 pointer-events-none opacity-[0.035] editorial-mesh-pattern z-0" />
        </>
      )}

      {theme === 'editorial-light' && (
        <>
          <div className="fixed top-[-100px] right-[-80px] w-[480px] h-[480px] bg-indigo-200/40 rounded-full blur-[120px] pointer-events-none z-0" />
          <div className="fixed bottom-[-100px] left-[-80px] w-[480px] h-[480px] bg-rose-200/30 rounded-full blur-[140px] pointer-events-none z-0" />
          <div className="fixed inset-0 pointer-events-none opacity-[0.04] editorial-mesh-pattern-light z-0" />
        </>
      )}

      <div className="flex relative z-10">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          tasks={tasks}
          user={currentUser}
          onLogout={handleLogout}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 flex flex-col min-h-screen">
          {/* Top Navbar */}
          <Navbar
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
            onOpenAddModal={() => {
              setEditingTask(null);
              setIsAddModalOpen(true);
            }}
            theme={theme}
            onToggleTheme={handleToggleThemeQuick}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            tasks={tasks}
            onStartFocus={(task) => setFocusingTask(task)}
          />

          {/* View Container with Fluid Transitions */}
          <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                {activeTab === 'dashboard' && (
                  <DashboardView
                    user={currentUser}
                    tasks={tasks}
                    onOpenAddModal={() => {
                      setEditingTask(null);
                      setIsAddModalOpen(true);
                    }}
                    onStartFocus={(task) => setFocusingTask(task)}
                    onNavigateTab={setActiveTab}
                    onToggleTask={handleToggleTask}
                    onEditTask={(task) => {
                      setEditingTask(task);
                      setIsAddModalOpen(true);
                    }}
                  />
                )}

                {activeTab === 'tasks' && (
                  <TasksView
                    tasks={tasks}
                    onToggleTask={handleToggleTask}
                    onEditTask={(task) => {
                      setEditingTask(task);
                      setIsAddModalOpen(true);
                    }}
                    onDeleteTask={handleDeleteTask}
                    onStartFocus={(task) => setFocusingTask(task)}
                    onOpenAddModal={() => {
                      setEditingTask(null);
                      setIsAddModalOpen(true);
                    }}
                  />
                )}

                {activeTab === 'focus' && (
                  <FocusView
                    tasks={tasks}
                    onToggleTask={handleToggleTask}
                    onOpenAddModal={() => {
                      setEditingTask(null);
                      setIsAddModalOpen(true);
                    }}
                  />
                )}

                {activeTab === 'matrix' && (
                  <MatrixView
                    tasks={tasks}
                    onToggleTask={handleToggleTask}
                    onEditTask={(task) => {
                      setEditingTask(task);
                      setIsAddModalOpen(true);
                    }}
                    onDeleteTask={handleDeleteTask}
                    onStartFocus={(task) => setFocusingTask(task)}
                    onOpenAddModal={() => {
                      setEditingTask(null);
                      setIsAddModalOpen(true);
                    }}
                  />
                )}

                {activeTab === 'ai' && (
                  <AIView
                    tasks={tasks}
                    onStartFocus={(task) => setFocusingTask(task)}
                    onToggleTask={handleToggleTask}
                  />
                )}

                {activeTab === 'analytics' && (
                  <AnalyticsView tasks={tasks} />
                )}

                {activeTab === 'settings' && (
                  <SettingsView
                    user={currentUser}
                    theme={theme}
                    onThemeChange={handleThemeChange}
                    soundEnabled={soundEnabled}
                    onToggleSound={handleToggleSound}
                    onResetDemoData={handleResetDemoData}
                    onExportData={handleExportData}
                    onImportData={handleImportData}
                    onLogout={handleLogout}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Add / Edit Task Modal */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        editingTask={editingTask}
      />

      {/* Pomodoro Focus Modal */}
      <FocusPomodoroModal
        task={focusingTask}
        isOpen={!!focusingTask}
        onClose={() => setFocusingTask(null)}
        onCompleteTask={handleToggleTask}
      />
    </div>
  );
}
