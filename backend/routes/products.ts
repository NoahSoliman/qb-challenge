import { Router, Request, Response , NextFunction } from 'express';
import { getProducts } from '../controllers/products';

const router = Router();


// Products endpoint
router.get('/', async (req: Request, res: Response , next: NextFunction) => {
    try {
       // Parse query params
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        // Clamp values to safe ranges
        const safePage = Math.max(page, 1);                // minimum = 1
        const safeLimit = Math.min(Math.max(limit, 1), 100);  // between 1 and 100

        // Use the SAFE versions
        const data = await getProducts(safePage, safeLimit);

        res.json(data);

    } catch (error) {
        next(error); // Forward to centralized error handler
    }
});

export default router;
