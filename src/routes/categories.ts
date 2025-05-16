import express from 'express';
import { getCategories, createCategory } from '../controllers/categories';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

router.get('/', getCategories);
router.post('/', authenticate, createCategory);

export default router;