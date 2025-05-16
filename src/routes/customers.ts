import express from 'express';
import { getCustomers, createCustomer, getCustomerById } from '../controllers/customers';
import { protect } from '../middlewares/auth';

const router = express.Router();

router.get('/', protect, getCustomers);
router.post('/', protect, createCustomer);
router.get('/:id', protect, getCustomerById);

export default router;