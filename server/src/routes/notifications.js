import { Router } from 'express';
import Notification from '../models/Notification.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { role, patientRef } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (patientRef) filter.patientRef = patientRef;
    res.json(await Notification.find(filter).sort({ createdAt: -1 }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/:id', async (req, res) => {
  try {
    res.json(await Notification.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
