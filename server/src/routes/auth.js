import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const { password: _, ...userObj } = user.toObject();
    res.json({ token, user: userObj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password, role, name, phone, ...rest } = req.body;
    if (!email || !password || !role || !name) return res.status(400).json({ error: 'Required fields missing' });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email: email.toLowerCase(), password: hashed, role, name, phone, ...rest });
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const { password: _, ...userObj } = user.toObject();
    res.status(201).json({ token, user: userObj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
