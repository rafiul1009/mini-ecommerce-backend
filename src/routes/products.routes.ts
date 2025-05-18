import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/products.controller';
import { adminMiddleware } from '../middlewares/admin.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

router.use(authMiddleware);
router.use(adminMiddleware);
// Protected routes - apply admin middleware
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;