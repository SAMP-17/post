import { Router } from 'express';
import DischargePlan from '../models/DischargePlan.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { patientRef } = req.query;
    const filter = patientRef ? { patientRef } : {};
    res.json(await DischargePlan.find(filter));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:patientRef', async (req, res) => {
  try {
    const plan = await DischargePlan.findOne({ patientRef: req.params.patientRef });
    if (!plan) return res.status(404).json({ error: 'No discharge plan found' });
    res.json(plan);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    res.status(201).json(await DischargePlan.create(req.body));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/:id', async (req, res) => {
  try {
    res.json(await DischargePlan.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
