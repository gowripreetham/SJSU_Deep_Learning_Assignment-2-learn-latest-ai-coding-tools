import { useEffect, useState } from 'react';
import { todosApi } from '../api';
import PriorityBadge from '../components/PriorityBadge';

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPriority, setEditPriority] = useState('Medium');

  const fetchTodos = async () => {
    try {
      const data = await todosApi.getAll();
      setTodos(Array.isArray(data) ? data : []);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await todosApi.create({ title: title.trim(), priority });
      setTitle('');
      setPriority('Medium');
      fetchTodos();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleToggle = async (todo) => {
    try {
      await todosApi.update(todo.id, { completed: !todo.completed });
      fetchTodos();
    } catch (e) {
      setError(e.message);
    }
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditPriority(todo.priority || 'Medium');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingId) return;
    try {
      await todosApi.update(editingId, { title: editTitle.trim(), priority: editPriority });
      setEditingId(null);
      setEditTitle('');
      setEditPriority('Medium');
      fetchTodos();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await todosApi.delete(id);
      if (editingId === id) setEditingId(null);
      fetchTodos();
    } catch (e) {
      setError(e.message);
    }
  };

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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Todos</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">Add and manage tasks with priorities</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleAdd} className="card p-4 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task..."
          className="input-base flex-1"
          aria-label="New todo title"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="input-base w-full sm:w-32"
          aria-label="Priority"
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button type="submit" className="btn-primary whitespace-nowrap">Add</button>
      </form>

      <ul className="space-y-3">
        {todos.map((todo) => (
          <li key={todo.id} className="card p-4 animate-fade-in">
            {editingId === todo.id ? (
              <form onSubmit={handleSaveEdit} className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="input-base flex-1 min-w-0"
                  autoFocus
                  aria-label="Edit title"
                />
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                  className="input-base w-28"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <button type="submit" className="btn-primary">Save</button>
                <button type="button" onClick={() => setEditingId(null)} className="btn-ghost">Cancel</button>
              </form>
            ) : (
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleToggle(todo)}
                  className="flex-shrink-0 h-5 w-5 rounded border-2 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                  aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
                >
                  {todo.completed && <span className="text-emerald-500 text-sm">✓</span>}
                </button>
                <div className="flex-1 min-w-0 relative">
                  <span className={`block ${todo.completed ? 'text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                    <span className="relative inline-block">
                      {todo.title}
                      {todo.completed && (
                        <span
                          className="absolute left-0 top-1/2 h-px -translate-y-1/2 bg-slate-400 dark:bg-slate-500 origin-left animate-strike w-full"
                          aria-hidden
                        />
                      )}
                    </span>
                  </span>
                </div>
                <PriorityBadge priority={todo.priority || 'Medium'} />
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => startEdit(todo)} className="btn-ghost text-sm">Edit</button>
                  <button
                    type="button"
                    onClick={() => handleDelete(todo.id)}
                    className="btn-ghost text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      {todos.length === 0 && !loading && (
        <p className="text-center text-slate-500 dark:text-slate-400 py-8">No todos yet. Add one above.</p>
      )}
    </div>
  );
}
