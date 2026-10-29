import { Router } from 'express';
import RecoveryEntry from '../models/RecoveryEntry.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { patientRef } = req.query;
    const filter = patientRef ? { patientRef } : {};
    res.json(await RecoveryEntry.find(filter).sort({ date: -1 }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    res.status(201).json(await RecoveryEntry.create(req.body));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
