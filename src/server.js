require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const contentRoutes = require('./routes/content');
const episodeRoutes = require('./routes/episodes');

const app = express();

app.use(express.json());

// CORS: en Render pon FRONTEND_URL = https://tufront.vercel.app
const allowed = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5500'
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, cb) {
      if (!origin) return cb(null, true);
      if (allowed.includes(origin)) return cb(null, true);
      if (origin.endsWith(".vercel.app")) return cb(null, true);
      return cb(new Error('CORS blocked: ' + origin));
    },
    credentials: true
  })
);

app.get('/', (req, res) => {
  res.json({ ok: true, name: 'RDR API', time: new Date().toISOString() });
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/content', contentRoutes);
app.use('/episodes', episodeRoutes);

const port = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(port, () => console.log('🚀 Server en puerto', port));
  })
  .catch((err) => {
    console.error('❌ No se pudo conectar a MongoDB', err);
    process.exit(1);
  });
