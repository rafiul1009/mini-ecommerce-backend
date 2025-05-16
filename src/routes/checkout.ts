import { Router } from 'express';
import { checkout } from '../controllers/checkout';
import { isAuthenticated } from '../middlewares/auth';

const router = Router();

router.post('/', isAuthenticated, checkout);

export default router;