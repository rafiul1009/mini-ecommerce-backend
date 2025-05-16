import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error';

// Import routes
import authRoutes from './routes/auth';
import customerRoutes from './routes/customers';
import cartRoutes from './routes/cart';
import categoryRoutes from './routes/categories';
import productRoutes from './routes/products';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);

// Error handling
app.use(errorHandler);

export default app;