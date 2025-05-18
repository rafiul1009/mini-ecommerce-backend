import { Router } from 'express';
import { checkout } from '../controllers/checkout.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

// Protected routes - apply auth middleware
router.post('/', checkout);

export default router;