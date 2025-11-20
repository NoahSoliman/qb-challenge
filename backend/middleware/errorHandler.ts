import { Request, Response, NextFunction } from 'express';

// Centralized error-handling middleware
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.error('Unhandled error:', err);

    // If error has a status (custom error), use it
    if (err.status && err.message) {
        return res.status(err.status).json({ error: err.message });
    }

    // Default fallback
    return res.status(500).json({ error: 'Internal server error' });
}