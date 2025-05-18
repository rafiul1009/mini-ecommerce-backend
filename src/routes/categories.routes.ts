import {Router} from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categories.controller';
import { adminMiddleware } from '../middlewares/admin.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/', getCategories);

router.use(authMiddleware);
router.use(adminMiddleware);
// Protected routes - apply admin middleware
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;