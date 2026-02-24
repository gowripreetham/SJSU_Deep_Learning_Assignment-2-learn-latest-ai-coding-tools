const express = require('express');
const { db } = require('../firebase');
const store = require('../store');

const router = express.Router();
const todayKey = () => new Date().toISOString().slice(0, 10);

// GET all habits
router.get('/', async (req, res, next) => {
  try {
    if (db) {
      const snap = await db.collection('habits').orderBy('createdAt', 'desc').get();
      return res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }
    res.json(store.getHabits());
  } catch (e) {
    next(e);
  }
});

// POST create habit
router.post('/', async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Habit name is required' });
    }
    const data = {
      name: name.trim(),
      streak: 0,
      lastCompletedDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (db) {
      const ref = await db.collection('habits').add(data);
      return res.status(201).json({ id: ref.id, ...data });
    }
    res.status(201).json(store.addHabit(data));
  } catch (e) {
    next(e);
  }
});

// PATCH update habit (e.g. name)
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (db) {
      const doc = db.collection('habits').doc(id);
      const existing = await doc.get();
      if (!existing.exists) return res.status(404).json({ error: 'Habit not found' });
      const updates = { updatedAt: new Date().toISOString() };
      if (req.body.name !== undefined) updates.name = String(req.body.name).trim();
      await doc.update(updates);
      const updated = await doc.get();
      return res.json({ id: updated.id, ...updated.data() });
    }
    const existing = store.getHabit(id);
    if (!existing) return res.status(404).json({ error: 'Habit not found' });
    const updates = { updatedAt: new Date().toISOString() };
    if (req.body.name !== undefined) updates.name = String(req.body.name).trim();
    res.json(store.updateHabit(id, updates));
  } catch (e) {
    next(e);
  }
});

// DELETE habit
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (db) {
      const doc = db.collection('habits').doc(id);
      const existing = await doc.get();
      if (!existing.exists) return res.status(404).json({ error: 'Habit not found' });
      await doc.delete();
      const checkSnap = await db.collection('habitCheckIns').where('habitId', '==', id).get();
      const batch = db.batch();
      checkSnap.docs.forEach((d) => batch.delete(d.ref));
      await batch.commit();
      return res.status(204).send();
    }
    if (!store.getHabit(id)) return res.status(404).json({ error: 'Habit not found' });
    store.deleteHabit(id);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

// GET check-ins for a habit
router.get('/:id/checkins', async (req, res, next) => {
  try {
    if (!db) return res.json([]);
    const { id } = req.params;
    const from = req.query.from || todayKey();
    const to = req.query.to || todayKey();
    const snap = await db.collection('habitCheckIns')
      .where('habitId', '==', id)
      .where('date', '>=', from)
      .where('date', '<=', to)
      .get();
    res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  } catch (e) {
    next(e);
  }
});

// POST check-in for today
router.post('/:id/checkin', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (db) {
      const habitRef = db.collection('habits').doc(id);
      const habitSnap = await habitRef.get();
      if (!habitSnap.exists) return res.status(404).json({ error: 'Habit not found' });
      const date = todayKey();
      const checkInQuery = await db.collection('habitCheckIns').where('habitId', '==', id).where('date', '==', date).limit(1).get();
      if (!checkInQuery.empty) return res.json({ alreadyChecked: true, date, habitId: id });
      await db.collection('habitCheckIns').add({ habitId: id, date, createdAt: new Date().toISOString() });
      const habit = habitSnap.data();
      const lastCompleted = habit.lastCompletedDate;
      let streak = habit.streak || 0;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayKey = yesterday.toISOString().slice(0, 10);
      if (lastCompleted === yesterdayKey) streak += 1;
      else if (lastCompleted !== date) streak = 1;
      await habitRef.update({ streak, lastCompletedDate: date, updatedAt: new Date().toISOString() });
      const updated = await habitRef.get();
      return res.status(201).json({ id: updated.id, ...updated.data(), checkedToday: true });
    }
    const habit = store.getHabit(id);
    if (!habit) return res.status(404).json({ error: 'Habit not found' });
    const result = store.addCheckIn(id);
    if (result.alreadyChecked) return res.json(result);
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
});

// GET today's check-in status for all habits
router.get('/today/status', async (req, res, next) => {
  try {
    if (db) {
      const date = todayKey();
      const snap = await db.collection('habitCheckIns').where('date', '==', date).get();
      const habitIds = snap.docs.map((d) => d.data().habitId);
      return res.json({ date, checkedHabitIds: habitIds });
    }
    res.json({ date: todayKey(), checkedHabitIds: store.getTodayCheckedHabitIds() });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
