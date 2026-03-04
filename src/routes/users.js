const express = require('express');
const User = require('../models/User');
const { authRequired } = require('../middleware/auth');

const router = express.Router();
router.use(authRequired);

router.get('/me', async (req, res) => {
  const user = await User.findById(req.user.id).select('-passwordHash');
  res.json(user);
});

// Favorites
router.get('/me/favorites', async (req, res) => {
  const user = await User.findById(req.user.id).populate('favorites');
  res.json(user?.favorites || []);
});

router.post('/me/favorites', async (req, res) => {
  const { contentId } = req.body;
  if (!contentId) return res.status(400).json({ error: 'contentId requerido' });

  await User.findByIdAndUpdate(req.user.id, { $addToSet: { favorites: contentId } });
  res.json({ message: 'Favorite added' });
});

router.delete('/me/favorites', async (req, res) => {
  const { contentId } = req.body;
  if (!contentId) return res.status(400).json({ error: 'contentId requerido' });

  await User.findByIdAndUpdate(req.user.id, { $pull: { favorites: contentId } });
  res.json({ message: 'Favorite removed' });
});

module.exports = router;
