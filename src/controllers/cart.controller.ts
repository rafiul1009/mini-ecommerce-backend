import { Response } from 'express';
import 'express-session';
import Product from '../models/Product';
import { AuthRequest } from '../middlewares/auth.middleware';
import { getCartItems } from '../utils/cart.utils';

declare module 'express-session' {
  interface Session {
    cart: { [key: string]: { productId: number; quantity: number } };
  }
}

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user!.id;

    if (!productId || quantity === undefined || quantity === null) {
      res.status(400).json({ message: 'Product ID and quantity are required' });
      return;
    }

    if (!req.session) {
      res.status(400).json({ message: 'Session is not available' });
      return;
    }

    if (!req.session?.cart) {
      req.session.cart = {};
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    const cartKey = userId + "_" + productId;
    const cartItem = req.session.cart[cartKey] || { productId, quantity: 0 };
    
    if (quantity === 0) {
      delete req.session.cart[cartKey];
      const cart = req.session?.cart || {};
      const cartItems = await getCartItems(cart, userId);
      res.json({
        message: 'Item removed from cart',
        data: cartItems
      });
      return;
    }

    // For non-zero quantities, validate they are positive
    if (quantity < 0) {
      res.status(400).json({ message: 'Quantity cannot be negative' });
      return;
    }

    cartItem.quantity = quantity; // Set absolute quantity instead of adding
    req.session.cart[cartKey] = cartItem;

    const cart = req.session?.cart || {};
    const cartItems = await getCartItems(cart, userId);

    res.json({
      message: 'Cart updated successfully',
      data: cartItems
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.session) {
      res.status(400).json({ message: 'Session is not available' });
      return;
    }
    
    const userId = req.user!.id;
    const cart = req.session?.cart || {};
    const cartItems = [];
    let total = 0;

    // Filter cart items for current user
    for (const [key, item] of Object.entries(cart)) {
      if (!key.startsWith(userId + "_")) continue;
      
      const product = await Product.findByPk(item.productId);
      if (product) {
        const itemTotal = product.price * item.quantity;
        cartItems.push({
          product,
          quantity: item.quantity,
          total: itemTotal,
        });
        total += itemTotal;
      }
    }

    res.json({
      message: 'Cart retrieved successfully',
      data: {
        items: cartItems,
        total
      }
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const clearCart = (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    
    // Only clear current user's cart items
    const updatedCart = Object.entries(req.session.cart || {})
      .filter(([key]) => !key.startsWith(userId + "_"))
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    
    req.session.cart = updatedCart;

    res.json({
      message: 'Cart cleared successfully',
      data: null
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};