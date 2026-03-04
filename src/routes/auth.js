const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    { id: user._id.toString(), email: user.email, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

router.post('/register', async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ error: 'Ese correo ya está registrado' });

    const passwordHash = await bcrypt.hash(password, 10);

    // Si es el primer usuario, lo dejamos como admin (útil para tu panel / seeds)
    const count = await User.estimatedDocumentCount();
    const role = count === 0 ? 'admin' : 'user';

    const user = await User.create({ email, name, passwordHash, role });
    const token = signToken(user);

    res.status(201).json({
      token,
      user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al registrar' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Faltan campos' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = signToken(user);

    res.json({
      token,
      user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

module.exports = router;
