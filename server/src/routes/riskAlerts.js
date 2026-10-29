import { Router } from 'express';
import RiskAlert from '../models/RiskAlert.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    res.json(await RiskAlert.find(filter).sort({ createdAt: -1 }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    res.status(201).json(await RiskAlert.create(req.body));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/:id', async (req, res) => {
  try {
    res.json(await RiskAlert.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
