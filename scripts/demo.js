#!/usr/bin/env node
/**
 * Run LifeTrack demo: starts API server + React dev server.
 * No Firebase or .env required – uses in-memory storage.
 */
const { spawn } = require('child_process');
const path = require('path');
const root = path.resolve(__dirname, '..');

const server = spawn('node', ['index.js'], {
  cwd: path.join(root, 'server'),
  stdio: 'inherit',
  env: { ...process.env, PORT: process.env.PORT || '5001' },
});

const client = spawn('npm', ['run', 'dev'], {
  cwd: path.join(root, 'client'),
  stdio: 'inherit',
  shell: true,
});

function killAll() {
  server.kill();
  client.kill();
  process.exit(0);
}

process.on('SIGINT', killAll);
process.on('SIGTERM', killAll);

server.on('error', (err) => {
  console.error('Server failed:', err.message);
  killAll();
});
client.on('error', (err) => {
  console.error('Client failed:', err.message);
  killAll();
});

server.on('exit', (code) => {
  if (code !== 0 && code !== null) killAll();
});
client.on('exit', (code) => {
  if (code !== 0 && code !== null) killAll();
});
