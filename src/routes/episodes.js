const express = require('express');
const Episode = require('../models/Episode');
const { authRequired, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.use(authRequired);

// GET by content
router.get('/content/:contentId', async (req, res) => {
  const episodes = await Episode.find({ contentId: req.params.contentId }).sort({ season: 1, episodeNumber: 1 });
  res.json(episodes);
});

// GET one
router.get('/:id', async (req, res) => {
  const ep = await Episode.findById(req.params.id);
  if (!ep) return res.status(404).json({ error: 'Episode not found' });
  res.json(ep);
});

// CREATE
router.post('/', adminOnly, async (req, res) => {
  const { contentId, season, episodeNumber, title, videoUrl, thumbnail } = req.body;

  if (!contentId || season == null || episodeNumber == null || !title || !videoUrl) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const created = await Episode.create({
      contentId,
      season: Number(season),
      episodeNumber: Number(episodeNumber),
      title,
      videoUrl,
      thumbnail: thumbnail || ''
    });
    res.status(201).json({ id: created._id.toString() });
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ error: 'Ese episodio ya existe' });
    console.error(e);
    res.status(500).json({ error: 'Error creando episodio' });
  }
});

// UPDATE
router.put('/:id', adminOnly, async (req, res) => {
  await Episode.findByIdAndUpdate(req.params.id, req.body, { runValidators: true });
  res.json({ message: 'Episode updated' });
});

// DELETE
router.delete('/:id', adminOnly, async (req, res) => {
  await Episode.findByIdAndDelete(req.params.id);
  res.json({ message: 'Episode deleted' });
});

module.exports = router;
