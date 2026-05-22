import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { seedCurriculum, seedExercisesFull } from './curriculumSeed.js';
import {
  normalizeCurriculum,
  clearAssignmentIdFromCurriculum,
  renameAssignmentIdInCurriculum,
} from './curriculumUtils.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.DATA_DIR || __dirname;
const DB_PATH = join(DATA_DIR, 'data.json');
export const UPLOADS_DIR = join(DATA_DIR, 'uploads');

if (!existsSync(UPLOADS_DIR)) mkdirSync(UPLOADS_DIR, { recursive: true });

const defaultAvatar = {
  skin: '#F5D0A9',
  hair: 'brown',
  hairStyle: 'short',
  top: 'default',
  bottom: 'default',
  shoes: 'default',
  accessory: 'none',
};

function load() {
  if (!existsSync(DB_PATH)) {
    return {
      users: [],
      completions: [],
      streaks: [],
      curriculum: normalizeCurriculum(seedCurriculum),
      exercises: seedExercisesFull,
    };
  }
  const data = JSON.parse(readFileSync(DB_PATH, 'utf8'));
  let repaired = false;
  if (!data.curriculum) {
    data.curriculum = normalizeCurriculum(seedCurriculum);
    repaired = true;
  } else {
    data.curriculum = normalizeCurriculum(data.curriculum);
  }
  if (!data.exercises?.length) {
    data.exercises = seedExercisesFull;
    repaired = true;
  }
  if (!data.users) data.users = [];
  if (!data.completions) data.completions = [];
  if (!data.streaks) data.streaks = [];
  if (repaired) save(data);
  return data;
}

function save(data) {
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

const db = {
  getUsers: () => load().users,
  getUserById: (id) => load().users.find((u) => u.id === id),
  getUserByEmail: (email) => load().users.find((u) => u.email === email),
  getUserByUsername: (username) => load().users.find((u) => u.username === username),
  insertUser: (user) => {
    const data = load();
    data.users.push(user);
    save(data);
  },
  updateUser: (id, updates) => {
    const data = load();
    const idx = data.users.findIndex((u) => u.id === id);
    if (idx >= 0) {
      data.users[idx] = { ...data.users[idx], ...updates };
      save(data);
    }
  },
  getCompletions: (userId) => load().completions.filter((c) => c.user_id === userId),
  addCompletion: (completion) => {
    const data = load();
    data.completions.push(completion);
    save(data);
  },
  hasCompletion: (userId, exerciseId) =>
    load().completions.some((c) => c.user_id === userId && c.exercise_id === exerciseId),
  getStreak: (userId) => load().streaks.find((s) => s.user_id === userId),
  setStreak: (streak) => {
    const data = load();
    const idx = data.streaks.findIndex((s) => s.user_id === streak.user_id);
    if (idx >= 0) data.streaks[idx] = streak;
    else data.streaks.push(streak);
    save(data);
  },
  getCurriculum: () => load().curriculum,
  saveCurriculum: (curriculum) => {
    const data = load();
    data.curriculum = normalizeCurriculum(curriculum);
    save(data);
  },
  getExercises: () => load().exercises,
  getExercise: (id) => load().exercises.find((e) => e.id === id),
  saveExercise: (exercise) => {
    const data = load();
    const idx = data.exercises.findIndex((e) => e.id === exercise.id);
    if (idx >= 0) data.exercises[idx] = exercise;
    else data.exercises.push(exercise);
    save(data);
  },
  deleteExercise: (id) => {
    const data = load();
    data.exercises = data.exercises.filter((e) => e.id !== id);
    data.curriculum = clearAssignmentIdFromCurriculum(data.curriculum, id);
    save(data);
  },
  renameExercise: (oldId, newId, updates) => {
    const data = load();
    const idx = data.exercises.findIndex((e) => e.id === oldId);
    if (idx < 0) return false;
    const next = { ...data.exercises[idx], ...updates, id: newId };
    data.exercises[idx] = next;
    data.curriculum = renameAssignmentIdInCurriculum(data.curriculum, oldId, newId);
    save(data);
    return true;
  },
};

export { db, defaultAvatar };
