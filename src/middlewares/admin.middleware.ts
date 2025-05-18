import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import User from '../models/User';

export const adminMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: ['type']
    });

    if (!user || user.type !== 'admin') {
      res.status(403).json({ message: 'Access denied. Admin only.' });
      return;
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};