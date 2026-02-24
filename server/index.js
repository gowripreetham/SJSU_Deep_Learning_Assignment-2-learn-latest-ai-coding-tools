const path = require('path');
try {
  require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
} catch (_) {}

const express = require('express');
const cors = require('cors');
const { db } = require('./firebase');
const todosRouter = require('./routes/todos');
const habitsRouter = require('./routes/habits');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true }));
app.use(express.json());

app.use('/api/todos', todosRouter);
app.use('/api/habits', habitsRouter);

app.get('/api/health', (_, res) => res.json({ ok: true }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  const mode = db ? 'Firebase' : 'demo (in-memory)';
  console.log(`LifeTrack API running at http://localhost:${PORT} [${mode}]`);
});
