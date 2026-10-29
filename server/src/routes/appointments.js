import { Router } from 'express';
import Appointment from '../models/Appointment.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { patientRef } = req.query;
    const filter = patientRef ? { patientRef } : {};
    res.json(await Appointment.find(filter).sort({ date: 1 }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    res.status(201).json(await Appointment.create(req.body));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/:id', async (req, res) => {
  try {
    res.json(await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
