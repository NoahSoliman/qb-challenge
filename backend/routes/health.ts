// /backend/routes/health.ts
import { Router, Request, Response } from 'express';
import { pool } from '../db';

const router = Router();

// Health check
router.get('/', async (_: Request, res: Response) => {
  try {
    await pool.execute('SELECT 1+1');
    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ status: 'error' });
  }
});

export default router;
