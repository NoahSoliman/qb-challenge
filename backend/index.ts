// /backend/index.ts
import express, { Request, Response } from 'express';
import { getProducts } from './controllers/products';
import { pool } from './db';
import { z } from 'zod';

const app = express();
const port = process.env.PORT || 3001;
app.use(express.json());

// -----------------------------
// Health check
// -----------------------------
app.get('/health', async (_: Request, res: Response) => {
  try {
    await pool.execute('SELECT 1+1');
    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ status: 'error' });
  }
});


// -----------------------------
// Zod schema for query validation
// -----------------------------
const querySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/)       // must be a string containing digits only
    .transform(Number)    // convert to number
    .optional(),          // optional because we provide a default later
  limit: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .optional(),
});

// -----------------------------
// Products endpoint
// -----------------------------
app.get('/products', async (req: Request, res: Response) => {
  try {
    const parsed = querySchema.parse(req.query);
    const page = Math.max(1, parsed.page ?? 1);        // minimum 1
    const limit = Math.min(100, Math.max(1, parsed.limit ?? 10)); // 1–100

    // Fetch products from DB
    const data = await getProducts(page, limit);
    res.json(data);
  } catch (error) {
    console.error('Database error:', error);

    // Friendly error for end user
    res.status(500).json({
      error: 'Unable to fetch products at the moment, please try again later.',
    });
  }
});

// -----------------------------
// Start server
// -----------------------------
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export { app };
