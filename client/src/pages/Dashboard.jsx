import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { todosApi, habitsApi } from '../api';

export default function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [habits, setHabits] = useState([]);
  const [todayChecked, setTodayChecked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setError(null);
        const [todosRes, habitsRes, statusRes] = await Promise.all([
          todosApi.getAll(),
          habitsApi.getAll(),
          habitsApi.todayStatus(),
        ]);
        if (!cancelled) {
          setTodos(Array.isArray(todosRes) ? todosRes : []);
          setHabits(Array.isArray(habitsRes) ? habitsRes : []);
          setTodayChecked(statusRes?.checkedHabitIds || []);
        }
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const totalTasks = todos.length;
  const completedTasks = todos.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionPct = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const habitsDoneToday = todayChecked.length;
  const totalHabits = habits.length;
  const habitPct = totalHabits ? Math.round((habitsDoneToday / totalHabits) * 100) : 0;
  const dayScore = totalTasks + totalHabits ? Math.round((completedTasks + habitsDoneToday) / (totalTasks + totalHabits) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6 text-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Ensure the API is running and Firebase is configured.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">Your progress at a glance</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="card p-5">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Today's completion</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">{dayScore}%</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Tasks + habits</p>
        </div>
        <div className="card p-5">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Todos</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{completedTasks} / {totalTasks}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{completionPct}% done</p>
        </div>
        <div className="card p-5 sm:col-span-2 lg:col-span-1">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Habits today</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{habitsDoneToday} / {totalHabits}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{habitPct}% checked in</p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900 dark:text-white">Recent todos</h2>
            <Link to="/todos" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">View all</Link>
          </div>
          <ul className="mt-4 space-y-2">
            {todos.slice(0, 5).map((t) => (
              <li key={t.id} className="flex items-center gap-2 text-sm">
                <span className={`flex-shrink-0 h-4 w-4 rounded border ${t.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 dark:border-slate-600'}`} />
                <span className={t.completed ? 'line-through text-slate-500 dark:text-slate-400' : ''}>{t.title}</span>
              </li>
            ))}
            {todos.length === 0 && <li className="text-slate-500 dark:text-slate-400 text-sm">No todos yet</li>}
          </ul>
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900 dark:text-white">Habit streaks</h2>
            <Link to="/habits" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">View all</Link>
          </div>
          <ul className="mt-4 space-y-2">
            {habits.slice(0, 5).map((h) => (
              <li key={h.id} className="flex items-center justify-between text-sm">
                <span>{h.name}</span>
                <span className="font-medium text-amber-600 dark:text-amber-400">{h.streak || 0} day streak</span>
              </li>
            ))}
            {habits.length === 0 && <li className="text-slate-500 dark:text-slate-400 text-sm">No habits yet</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
