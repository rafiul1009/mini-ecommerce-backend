import express from 'express';
import { addToCart, getCart, clearCart } from '../controllers/cart';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

router.post('/add', authenticate, addToCart);
router.get('/', authenticate, getCart);
router.delete('/clear', authenticate, clearCart);

export default router;