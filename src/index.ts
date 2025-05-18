import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import sequelize  from './config/database.config';
import { FRONTEND_URL, JWT_SECRET, NODE_ENV, PORT } from './config';
import { runSeeders } from './seeders';
import defineAssociations from './models/associations';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

// Import routes
import authRoutes from './routes/auth.routes';
import cartRoutes from './routes/cart.routes';
import categoryRoutes from './routes/categories.routes';
import productRoutes from './routes/products.routes';
import checkoutRoutes from './routes/checkout.routes';


const app = express();

// CORS configuration
app.use(cors({
  origin: FRONTEND_URL, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(session({
  secret: JWT_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  }
}));

// Middleware
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/cart', cartRoutes);
app.use('/checkout', checkoutRoutes);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// 404 not found handler
app.use(notFoundHandler);

// Common error handler
app.use(errorHandler);

async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Define model associations
    defineAssociations();
    console.log('Model associations defined.');

    // Sync database models
    await sequelize.sync();
    console.log('Database models synchronized.');

    // Run database seeders
    await runSeeders();
    console.log('Database seeders completed.');

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();