import { Router } from 'express';
import Medication from '../models/Medication.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { patientRef } = req.query;
    const filter = patientRef ? { patientRef } : {};
    res.json(await Medication.find(filter));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/:id', async (req, res) => {
  try {
    const med = await Medication.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(med);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    res.status(201).json(await Medication.create(req.body));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
