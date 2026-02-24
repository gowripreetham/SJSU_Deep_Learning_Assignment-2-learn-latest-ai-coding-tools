import { useEffect, useState } from 'react';
import { habitsApi } from '../api';

export default function Habits() {
  const [habits, setHabits] = useState([]);
  const [todayChecked, setTodayChecked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const fetchData = async () => {
    try {
      const [habitsRes, statusRes] = await Promise.all([
        habitsApi.getAll(),
        habitsApi.todayStatus(),
      ]);
      setHabits(Array.isArray(habitsRes) ? habitsRes : []);
      setTodayChecked(statusRes?.checkedHabitIds || []);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await habitsApi.create({ name: name.trim() });
      setName('');
      fetchData();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleCheckIn = async (id) => {
    try {
      await habitsApi.checkIn(id);
      fetchData();
    } catch (e) {
      setError(e.message);
    }
  };

  const startEdit = (habit) => {
    setEditingId(habit.id);
    setEditName(habit.name);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingId) return;
    try {
      await habitsApi.update(editingId, { name: editName.trim() });
      setEditingId(null);
      setEditName('');
      fetchData();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await habitsApi.delete(id);
      if (editingId === id) setEditingId(null);
      fetchData();
    } catch (e) {
      setError(e.message);
    }
  };

  const isCheckedToday = (id) => todayChecked.includes(id);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Habits</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">Daily habits with streak tracking</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleAdd} className="card p-4 flex gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Habit name (e.g. Drink water)"
          className="input-base flex-1"
          aria-label="New habit name"
        />
        <button type="submit" className="btn-primary whitespace-nowrap">Add habit</button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2">
        {habits.map((habit) => (
          <div key={habit.id} className="card p-5 animate-fade-in">
            {editingId === habit.id ? (
              <form onSubmit={handleSaveEdit} className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="input-base flex-1 min-w-0"
                  autoFocus
                  aria-label="Edit habit name"
                />
                <button type="submit" className="btn-primary">Save</button>
                <button type="button" onClick={() => setEditingId(null)} className="btn-ghost">Cancel</button>
              </form>
            ) : (
              <>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{habit.name}</h3>
                    <p className="mt-1 text-sm text-amber-600 dark:text-amber-400 font-medium">
                      {habit.streak || 0} day streak
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => startEdit(habit)} className="btn-ghost text-sm">Edit</button>
                    <button
                      type="button"
                      onClick={() => handleDelete(habit.id)}
                      className="btn-ghost text-sm text-red-600 dark:text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => handleCheckIn(habit.id)}
                    disabled={isCheckedToday(habit.id)}
                    className={`w-full rounded-lg border-2 py-2.5 text-sm font-medium transition-colors ${
                      isCheckedToday(habit.id)
                        ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 cursor-default'
                        : 'border-slate-300 dark:border-slate-600 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {isCheckedToday(habit.id) ? '✓ Done today' : 'Check in today'}
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      {habits.length === 0 && !loading && (
        <p className="text-center text-slate-500 dark:text-slate-400 py-8">No habits yet. Add one above.</p>
      )}
    </div>
  );
}
