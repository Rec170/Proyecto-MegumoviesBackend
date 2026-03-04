const express = require('express');
const Content = require('../models/Content');
const Episode = require('../models/Episode');
const { authRequired, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.use(authRequired);

// GET all
router.get('/', async (req, res) => {
  const items = await Content.find().sort({ createdAt: -1 });
  res.json(items);
});

// GET by title
router.get('/title/:title', async (req, res) => {
  const item = await Content.findOne({ title: req.params.title });
  if (!item) return res.status(404).json({ error: 'Content not found' });
  res.json(item);
});

// GET by id
router.get('/:id', async (req, res) => {
  const item = await Content.findById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Content not found' });
  res.json(item);
});

// CREATE
router.post('/', adminOnly, async (req, res) => {
  const { title, description, thumbnail, isMovie } = req.body;
  if (!title || !description || typeof isMovie !== 'boolean') {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const created = await Content.create({ title, description, thumbnail: thumbnail || '', isMovie });
  res.status(201).json({ id: created._id.toString() });
});

// UPDATE
router.put('/:id', adminOnly, async (req, res) => {
  await Content.findByIdAndUpdate(req.params.id, req.body, { runValidators: true });
  res.json({ message: 'Content updated' });
});

// DELETE (and episodes)
router.delete('/:id', adminOnly, async (req, res) => {
  await Episode.deleteMany({ contentId: req.params.id });
  await Content.findByIdAndDelete(req.params.id);
  res.json({ message: 'Content and episodes deleted' });
});

module.exports = router;
