import { Router } from 'express';
import { addToCart, getCart, clearCart } from '../controllers/cart.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

// Protected routes - apply auth middleware
router.get('/', getCart);
router.post('/add', addToCart);
router.delete('/clear', clearCart);

export default router;