const express = require('express');
const { db } = require('../firebase');
const store = require('../store');

const router = express.Router();

// GET all todos
router.get('/', async (req, res, next) => {
  try {
    if (db) {
      const snap = await db.collection('todos').orderBy('createdAt', 'desc').get();
      return res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }
    res.json(store.getTodos());
  } catch (e) {
    next(e);
  }
});

// POST create todo
router.post('/', async (req, res, next) => {
  try {
    const { title, priority = 'Medium', completed = false } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const data = {
      title: title.trim(),
      priority: ['High', 'Medium', 'Low'].includes(priority) ? priority : 'Medium',
      completed: !!completed,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (db) {
      const ref = await db.collection('todos').add(data);
      return res.status(201).json({ id: ref.id, ...data });
    }
    res.status(201).json(store.addTodo(data));
  } catch (e) {
    next(e);
  }
});

// PATCH update todo
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (db) {
      const doc = db.collection('todos').doc(id);
      const existing = await doc.get();
      if (!existing.exists) return res.status(404).json({ error: 'Todo not found' });
      const updates = {};
      if (req.body.title !== undefined) updates.title = String(req.body.title).trim();
      if (req.body.priority !== undefined) updates.priority = ['High', 'Medium', 'Low'].includes(req.body.priority) ? req.body.priority : existing.data().priority;
      if (req.body.completed !== undefined) updates.completed = !!req.body.completed;
      updates.updatedAt = new Date().toISOString();
      await doc.update(updates);
      const updated = await doc.get();
      return res.json({ id: updated.id, ...updated.data() });
    }
    const existing = store.getTodo(id);
    if (!existing) return res.status(404).json({ error: 'Todo not found' });
    const updates = { updatedAt: new Date().toISOString() };
    if (req.body.title !== undefined) updates.title = String(req.body.title).trim();
    if (req.body.priority !== undefined) updates.priority = ['High', 'Medium', 'Low'].includes(req.body.priority) ? req.body.priority : existing.priority;
    if (req.body.completed !== undefined) updates.completed = !!req.body.completed;
    res.json(store.updateTodo(id, updates));
  } catch (e) {
    next(e);
  }
});

// DELETE todo
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (db) {
      const doc = db.collection('todos').doc(id);
      const existing = await doc.get();
      if (!existing.exists) return res.status(404).json({ error: 'Todo not found' });
      await doc.delete();
      return res.status(204).send();
    }
    if (!store.getTodo(id)) return res.status(404).json({ error: 'Todo not found' });
    store.deleteTodo(id);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

module.exports = router;
