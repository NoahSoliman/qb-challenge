// /backend/routes/health.ts
import { Router, Request, Response, NextFunction } from 'express';
import { pool } from '../db';

const router = Router();

// Health check
router.get('/', async (_: Request, res: Response, next: NextFunction) => {
    try {
        await pool.execute('SELECT 1+1');
        res.json({ status: 'ok' });
    } catch (error) {
        return next({ status: 500, message: 'Health check failed' })
    }
});

export default router;
