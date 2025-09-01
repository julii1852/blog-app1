const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const secret = process.env.JWT_SECRET || 'secret';

// register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'Email exists' });
    user = new User({ username, email, password });
    await user.save();
    res.json({ message: 'ok' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ error: 'No user' });
    const match = await user.comparePassword(password);
    if(!match) return res.status(400).json({ error: 'Wrong password' });
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
