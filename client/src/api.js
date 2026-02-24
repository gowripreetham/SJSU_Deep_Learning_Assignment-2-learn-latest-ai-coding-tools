const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

async function request(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

export const todosApi = {
  getAll: () => request('/api/todos'),
  create: (body) => request('/api/todos', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/api/todos/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (id) => request(`/api/todos/${id}`, { method: 'DELETE' }),
};

export const habitsApi = {
  getAll: () => request('/api/habits'),
  create: (body) => request('/api/habits', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/api/habits/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (id) => request(`/api/habits/${id}`, { method: 'DELETE' }),
  checkIn: (id) => request(`/api/habits/${id}/checkin`, { method: 'POST' }),
  todayStatus: () => request('/api/habits/today/status'),
};
