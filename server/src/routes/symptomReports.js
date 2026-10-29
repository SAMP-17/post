import { Router } from 'express';
import SymptomReport from '../models/SymptomReport.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { patientRef } = req.query;
    const filter = patientRef ? { patientRef } : {};
    res.json(await SymptomReport.find(filter).sort({ date: -1 }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    res.status(201).json(await SymptomReport.create(req.body));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
