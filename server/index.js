import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import { db, defaultAvatar, UPLOADS_DIR } from './db.js';
import { SHOP_ITEMS, ACHIEVEMENTS } from './shop.js';
import { findSubtopic, youtubeEmbedUrl } from './curriculumUtils.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'elementary-learning-hub-secret-change-in-production';
const isProd = process.env.NODE_ENV === 'production';

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (req, file, cb) => {
    const ext = extname(file.originalname) || '.mp4';
    cb(null, `${req.params.subject}-${req.params.topicId}-${req.params.subtopicId}-${Date.now()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) cb(null, true);
    else cb(new Error('Only video files allowed'));
  },
});

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());
app.use('/uploads', express.static(UPLOADS_DIR));

function parseJson(val, fallback) {
  try {
    return JSON.parse(val || JSON.stringify(fallback));
  } catch (e) {
    return fallback;
  }
}

function getAllExercisesList() {
  return db.getExercises().map((e) => ({
    id: e.id,
    subject: e.subject,
    topic: e.title,
    title: e.title,
    points: e.points || 15,
  }));
}

function rowToUser(row) {
  if (!row) return null;
  const completions = db.getCompletions(row.id);
  const exercises = db.getExercises();
  const subjects = [...new Set(completions.map((c) => c.subject))];
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    parentEmail: row.parent_email,
    age: row.age,
    grade: row.grade,
    characterGender: row.character_gender,
    avatar: parseJson(row.avatar_json, defaultAvatar),
    points: row.points,
    stars: row.stars,
    streak: row.streak,
    ownedItems: parseJson(row.owned_items_json, []),
    isAdmin: !!row.is_admin,
    completedExercises: completions.map((c) => c.exercise_id),
    stats: {
      completedCount: completions.length,
      subjectsCompleted: subjects.length,
      totalLevels: completions.length,
      maxLevels: Math.max(60, exercises.length * 10),
      maxStars: 180,
      accuracy: exercises.length
        ? Math.min(100, Math.round((completions.length / exercises.length) * 100))
        : 0,
    },
  };
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  const token = bearer || req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  try {
    req.userId = jwt.verify(token, JWT_SECRET).userId;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

function adminMiddleware(req, res, next) {
  authMiddleware(req, res, () => {
    const row = db.getUserById(req.userId);
    if (!row || !row.is_admin) return res.status(403).json({ error: 'Admin only' });
    next();
  });
}

function setAuthCookie(res, token) {
  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: 'lax',
    secure: isProd,
  });
}

function updateStreak(userId) {
  const today = new Date().toISOString().slice(0, 10);
  const row = db.getStreak(userId);
  if (!row) {
    db.setStreak({ user_id: userId, last_login_date: today, streak: 1 });
    db.updateUser(userId, { streak: 1 });
    return 1;
  }
  if (row.last_login_date === today) return row.streak;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const newStreak = row.last_login_date === yesterday ? row.streak + 1 : 1;
  db.setStreak({ user_id: userId, last_login_date: today, streak: newStreak });
  db.updateUser(userId, { streak: newStreak });
  return newStreak;
}

function resolveSubtopicParams(curriculum, subjectId, topicId, subtopicId) {
  let found = findSubtopic(curriculum, subjectId, topicId, subtopicId);
  if (found) return found;
  return findSubtopic(curriculum, subjectId, subtopicId, topicId);
}

// ——— Auth ———
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, parentEmail, age, grade, characterGender } = req.body;
    const cleanUsername = String(username || '').trim();
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanParent = String(parentEmail || '').trim();

    if (!cleanUsername || !cleanEmail || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    if (cleanParent && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanParent)) {
      return res.status(400).json({ error: 'Parent email is not valid' });
    }
    if (db.getUserByEmail(cleanEmail) || db.getUserByUsername(cleanUsername)) {
      return res.status(409).json({ error: 'Email or username already exists' });
    }
    const id = uuid();
    const hash = await bcrypt.hash(password, 10);
    const owned = ['skin-light', 'skin-medium', 'top-default', 'bottom-default', 'shoes-default', 'hair-brown'];
    db.insertUser({
      id,
      username: cleanUsername,
      email: cleanEmail,
      password_hash: hash,
      parent_email: cleanParent || null,
      age: age || 7,
      grade: grade || 1,
      character_gender: characterGender || 'girl',
      avatar_json: JSON.stringify({ ...defaultAvatar }),
      owned_items_json: JSON.stringify(owned),
      points: 0,
      stars: 0,
      streak: 1,
      is_admin: 0,
      created_at: new Date().toISOString(),
    });
    updateStreak(id);
    const token = jwt.sign({ userId: id }, JWT_SECRET, { expiresIn: '30d' });
    setAuthCookie(res, token);
    const user = rowToUser(db.getUserById(id));
    res.json({ user, token });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const row = db.getUserByEmail(String(email || '').trim().toLowerCase());
  if (!row || !(await bcrypt.compare(password, row.password_hash))) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  updateStreak(row.id);
  const token = jwt.sign({ userId: row.id }, JWT_SECRET, { expiresIn: '30d' });
  setAuthCookie(res, token);
  res.json({ user: rowToUser(row), token });
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ ok: true });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const row = db.getUserById(req.userId);
  if (!row) return res.status(404).json({ error: 'User not found' });
  res.json({ user: rowToUser(row) });
});

app.patch('/api/user/avatar', authMiddleware, (req, res) => {
  const { avatar, characterGender } = req.body;
  const row = db.getUserById(req.userId);
  const current = parseJson(row.avatar_json, defaultAvatar);
  const updated = avatar ? Object.assign({}, current, avatar) : current;
  const updates = { avatar_json: JSON.stringify(updated) };
  if (characterGender) updates.character_gender = characterGender;
  db.updateUser(req.userId, updates);
  res.json({ user: rowToUser(db.getUserById(req.userId)) });
});

// ——— Curriculum (public read) ———
app.get('/api/curriculum', (req, res) => {
  res.json({ curriculum: db.getCurriculum() });
});

app.get('/api/curriculum/:subject/:topicId/:subtopicId', (req, res) => {
  const found = resolveSubtopicParams(
    db.getCurriculum(),
    req.params.subject,
    req.params.topicId,
    req.params.subtopicId
  );
  if (!found) return res.status(404).json({ error: 'Subtopic not found' });
  res.json({
    subject: found.subject,
    topic: found.topic,
    subtopic: found.subtopic,
    youtubeEmbed: youtubeEmbedUrl(found.subtopic.content?.youtubeUrl),
  });
});

// ——— Exercises ———
app.get('/api/exercises', (req, res) => {
  res.json({ exercises: getAllExercisesList() });
});

app.get('/api/exercises/:id', (req, res) => {
  const ex = db.getExercise(req.params.id);
  if (!ex) return res.status(404).json({ error: 'Assignment not found. It may have been deleted.' });
  res.json({ exercise: ex });
});

app.post('/api/exercises/:id/complete', authMiddleware, (req, res) => {
  const exercise = db.getExercise(req.params.id);
  if (!exercise) return res.status(404).json({ error: 'Assignment not found. It may have been deleted.' });
  if (db.hasCompletion(req.userId, exercise.id)) {
    return res.json({ user: rowToUser(db.getUserById(req.userId)), alreadyCompleted: true });
  }
  const points = exercise.points || 15;
  db.addCompletion({
    id: uuid(),
    user_id: req.userId,
    exercise_id: exercise.id,
    subject: exercise.subject,
    points_earned: points,
    stars_earned: 1,
    completed_at: new Date().toISOString(),
  });
  const row = db.getUserById(req.userId);
  db.updateUser(req.userId, { points: row.points + points, stars: row.stars + 1 });
  res.json({ user: rowToUser(db.getUserById(req.userId)), pointsEarned: points, starsEarned: 1 });
});

// ——— Admin: exercises ———
app.get('/api/admin/exercises', adminMiddleware, (req, res) => {
  res.json({ exercises: db.getExercises() });
});

app.post('/api/admin/exercises', adminMiddleware, (req, res) => {
  const { id, subject, title, points, questions } = req.body;
  if (!id?.trim() || !title || !questions?.length) {
    return res.status(400).json({ error: 'id, title, and questions required' });
  }
  db.saveExercise({
    id,
    subject: subject || 'math',
    title,
    points: points || 15,
    questions,
  });
  res.json({ exercise: db.getExercise(id) });
});

app.put('/api/admin/exercises/:id', adminMiddleware, (req, res) => {
  const existing = db.getExercise(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Assignment not found' });
  const newId = req.body.id?.trim();
  if (newId && newId !== req.params.id) {
    if (db.getExercise(newId)) {
      return res.status(409).json({ error: 'Another assignment already uses this id' });
    }
    const { id: _ignored, ...rest } = req.body;
    const ok = db.renameExercise(req.params.id, newId, rest);
    if (!ok) return res.status(404).json({ error: 'Assignment not found' });
    return res.json({ exercise: db.getExercise(newId) });
  }
  const updated = { ...existing, ...req.body, id: req.params.id };
  db.saveExercise(updated);
  res.json({ exercise: updated });
});

app.delete('/api/admin/exercises/:id', adminMiddleware, (req, res) => {
  if (!db.getExercise(req.params.id)) {
    return res.status(404).json({ error: 'Assignment not found' });
  }
  db.deleteExercise(req.params.id);
  res.json({ ok: true });
});

// ——— Admin: curriculum ———
const SUBJECT_THEMES = {
  blue: { gradientClass: 'math-bg', cardClass: 'math-card' },
  green: { gradientClass: 'english-bg', cardClass: 'english-card' },
  orange: { gradientClass: 'ukrainian-bg', cardClass: 'ukrainian-card' },
  purple: { gradientClass: 'purple-bg', cardClass: 'purple-card' },
  pink: { gradientClass: 'pink-bg', cardClass: 'pink-card' },
  teal: { gradientClass: 'teal-bg', cardClass: 'teal-card' },
};

function slugifySubjectId(name) {
  return String(name || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
}

app.put('/api/admin/curriculum', adminMiddleware, (req, res) => {
  if (!req.body.curriculum) return res.status(400).json({ error: 'curriculum required' });
  db.saveCurriculum(req.body.curriculum);
  res.json({ curriculum: db.getCurriculum() });
});

app.post('/api/admin/curriculum/subjects', adminMiddleware, (req, res) => {
  try {
    const { id, label, icon, theme } = req.body;
    const displayLabel = String(label || '').trim();
    if (!displayLabel) return res.status(400).json({ error: 'Subject name is required' });

    const subjectId = slugifySubjectId(id || displayLabel);
    if (!subjectId) return res.status(400).json({ error: 'Invalid subject id' });

    const curriculum = db.getCurriculum();
    if (curriculum[subjectId]) {
      return res.status(409).json({ error: 'A subject with this id already exists' });
    }

    const themeConfig = SUBJECT_THEMES[theme] || SUBJECT_THEMES.purple;
    curriculum[subjectId] = {
      id: subjectId,
      titleKey: subjectId,
      label: displayLabel,
      icon: String(icon || '📚').trim() || '📚',
      gradientClass: themeConfig.gradientClass,
      cardClass: themeConfig.cardClass,
      topics: [],
    };

    db.saveCurriculum(curriculum);
    res.status(201).json({ curriculum, subject: curriculum[subjectId] });
  } catch (err) {
    console.error('Create subject error:', err);
    res.status(500).json({ error: 'Failed to create subject' });
  }
});

app.post('/api/admin/curriculum/:subject/topics', adminMiddleware, (req, res) => {
  try {
    const { subject } = req.params;
    const { title, description, icon } = req.body;
    const topicTitle = String(title || '').trim();
    if (!topicTitle) return res.status(400).json({ error: 'Topic title is required' });

    const curriculum = db.getCurriculum();
    const subj = curriculum[subject];
    if (!subj) return res.status(404).json({ error: 'Subject not found' });

    const topicId = slugifySubjectId(title);
    if (subj.topics?.some((t) => t.id === topicId)) {
      return res.status(409).json({ error: 'Topic already exists in this subject' });
    }

    const topic = {
      id: topicId,
      title: topicTitle,
      description: String(description || '').trim() || '',
      icon: String(icon || '📁').trim() || '📁',
      subtopics: [],
    };

    if (!subj.topics) subj.topics = [];
    subj.topics.push(topic);
    db.saveCurriculum(curriculum);
    res.status(201).json({ curriculum, topic });
  } catch (err) {
    console.error('Create topic error:', err);
    res.status(500).json({ error: 'Failed to create topic' });
  }
});

app.put('/api/admin/curriculum/:subject/:topicId/:subtopicId', adminMiddleware, (req, res) => {
  const curriculum = db.getCurriculum();
  const found = resolveSubtopicParams(
    curriculum,
    req.params.subject,
    req.params.topicId,
    req.params.subtopicId
  );
  if (!found) return res.status(404).json({ error: 'Subtopic not found' });
  if (req.body.content) found.subtopic.content = { ...found.subtopic.content, ...req.body.content };
  if (req.body.name) found.subtopic.name = req.body.name;
  if (req.body.description) found.subtopic.description = req.body.description;
  if (req.body.icon) found.subtopic.icon = req.body.icon;
  db.saveCurriculum(curriculum);
  res.json({ subtopic: found.subtopic });
});

app.post(
  '/api/admin/curriculum/:subject/:topicId/:subtopicId/video',
  adminMiddleware,
  upload.single('video'),
  (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No video file' });
    const curriculum = db.getCurriculum();
    const found = resolveSubtopicParams(
      curriculum,
      req.params.subject,
      req.params.topicId,
      req.params.subtopicId
    );
    if (!found) return res.status(404).json({ error: 'Subtopic not found' });
    const videoUrl = `/uploads/${req.file.filename}`;
    found.subtopic.content.videoUrl = videoUrl;
    if (req.body.videoTitle) found.subtopic.content.videoTitle = req.body.videoTitle;
    if (req.body.videoDescription) found.subtopic.content.videoDescription = req.body.videoDescription;
    db.saveCurriculum(curriculum);
    res.json({ videoUrl, subtopic: found.subtopic });
  }
);

// ——— Shop & achievements ———
app.get('/api/shop/items', (req, res) => {
  res.json({ items: SHOP_ITEMS });
});

app.post('/api/shop/buy', authMiddleware, (req, res) => {
  const { itemId } = req.body;
  const item = SHOP_ITEMS.find((i) => i.id === itemId);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  const row = db.getUserById(req.userId);
  const owned = parseJson(row.owned_items_json, []);
  if (owned.includes(itemId)) return res.status(400).json({ error: 'Already owned' });
  if (row.points < item.cost) return res.status(400).json({ error: 'Not enough points' });
  owned.push(itemId);
  const avatar = parseJson(row.avatar_json, defaultAvatar);
  avatar[item.category] = item.value;
  db.updateUser(req.userId, {
    points: row.points - item.cost,
    owned_items_json: JSON.stringify(owned),
    avatar_json: JSON.stringify(avatar),
  });
  res.json({ user: rowToUser(db.getUserById(req.userId)) });
});

app.get('/api/achievements', authMiddleware, (req, res) => {
  const user = rowToUser(db.getUserById(req.userId));
  const stats = Object.assign({}, user.stats, { points: user.points, stars: user.stars, streak: user.streak });
  res.json({
    achievements: ACHIEVEMENTS.map((a) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      unlocked: a.check(stats),
    })),
  });
});

app.post('/api/auth/admin-login', async (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@learninghub.local' && password === 'admin123') {
    let row = db.getUserByEmail(email);
    if (!row) {
      const id = uuid();
      const hash = await bcrypt.hash(password, 10);
      db.insertUser({
        id,
        username: 'Admin',
        email,
        password_hash: hash,
        parent_email: null,
        age: null,
        grade: null,
        character_gender: 'girl',
        avatar_json: JSON.stringify({ ...defaultAvatar }),
        owned_items_json: '[]',
        points: 0,
        stars: 0,
        streak: 1,
        is_admin: 1,
        created_at: new Date().toISOString(),
      });
      row = db.getUserById(id);
    } else if (!row.is_admin) {
      db.updateUser(row.id, { is_admin: 1 });
      row = db.getUserById(row.id);
    }
    const token = jwt.sign({ userId: row.id }, JWT_SECRET, { expiresIn: '30d' });
    setAuthCookie(res, token);
    return res.json({ user: rowToUser(row), token });
  }
  res.status(401).json({ error: 'Invalid admin credentials' });
});

// ——— Static client ———
const clientDist = isProd ? join(__dirname, 'public') : join(__dirname, '../client/dist');

console.log(`clientDist: ${clientDist}`);

if (existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
    res.sendFile(join(clientDist, 'index.html'), (err) => {
      if (err) next();
    });
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
