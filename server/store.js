/**
 * In-memory store for demo/prototype mode (no Firebase required).
 */

const todos = new Map();
const habits = new Map();
const checkIns = [];

let todoId = 0;
let habitId = 0;
let checkInId = 0;

const nextTodoId = () => String(++todoId);
const nextHabitId = () => String(++habitId);
const nextCheckInId = () => String(++checkInId);
const todayKey = () => new Date().toISOString().slice(0, 10);

// --- Todos ---
function getTodos() {
  return Array.from(todos.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function addTodo(data) {
  const id = nextTodoId();
  const doc = { id, ...data };
  todos.set(id, doc);
  return doc;
}

function getTodo(id) {
  return todos.get(id) || null;
}

function updateTodo(id, updates) {
  const doc = todos.get(id);
  if (!doc) return null;
  Object.assign(doc, updates);
  return doc;
}

function deleteTodo(id) {
  return todos.delete(id);
}

// --- Habits ---
function getHabits() {
  return Array.from(habits.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function addHabit(data) {
  const id = nextHabitId();
  const doc = { id, ...data };
  habits.set(id, doc);
  return doc;
}

function getHabit(id) {
  return habits.get(id) || null;
}

function updateHabit(id, updates) {
  const doc = habits.get(id);
  if (!doc) return null;
  Object.assign(doc, updates);
  return doc;
}

function deleteHabit(id) {
  habits.delete(id);
  for (let i = checkIns.length - 1; i >= 0; i--) {
    if (checkIns[i].habitId === id) checkIns.splice(i, 1);
  }
}

// --- Check-ins ---
function getTodayCheckedHabitIds() {
  const date = todayKey();
  return checkIns.filter((c) => c.date === date).map((c) => c.habitId);
}

function hasCheckedInToday(habitId) {
  const date = todayKey();
  return checkIns.some((c) => c.habitId === habitId && c.date === date);
}

function addCheckIn(habitId) {
  const date = todayKey();
  if (hasCheckedInToday(habitId)) return { alreadyChecked: true, date, habitId };

  checkIns.push({ id: nextCheckInId(), habitId, date, createdAt: new Date().toISOString() });

  const habit = habits.get(habitId);
  const lastCompleted = habit.lastCompletedDate;
  let streak = habit.streak || 0;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);

  if (lastCompleted === yesterdayKey) {
    streak += 1;
  } else if (lastCompleted !== date) {
    streak = 1;
  }

  habit.streak = streak;
  habit.lastCompletedDate = date;
  habit.updatedAt = new Date().toISOString();

  return { ...habit, checkedToday: true };
}

module.exports = {
  getTodos,
  addTodo,
  getTodo,
  updateTodo,
  deleteTodo,
  getHabits,
  addHabit,
  getHabit,
  updateHabit,
  deleteHabit,
  getTodayCheckedHabitIds,
  addCheckIn,
  hasCheckedInToday,
};
