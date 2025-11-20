// /backend/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express'

/**
 * Simple centralized error handler.
 * - If `err.status` and `err.message` exist, return that status and message.
 * - Otherwise return 500 with a generic message.
 * - Always return JSON shaped as: { error: string }
 */
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // Log for server-side debugging (keeps console usage simple)
  console.error('Unhandled error:', err)

  // If a controller passed a proper { status, message }, use it
  if (err && typeof err === 'object' && 'status' in err && 'message' in err) {
    const status = Number(err.status) || 500
    return res.status(status).json({ error: String(err.message) })
  }

  // Default fallback response
  return res.status(500).json({ error: 'Internal server error' })
}
