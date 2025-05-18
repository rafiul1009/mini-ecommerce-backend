import { Router } from 'express';
import { register, login, logout, getUserDetails, getUserOrders } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

router.use(authMiddleware);

// Protected routes - apply auth middleware
router.get('/me', getUserDetails);
router.get('/me/orders', getUserOrders);

export default router;