import { Request, Response } from 'express';
import { AppError } from '../middlewares/error';
import Product from '../models/Product';

declare module 'express-session' {
  interface SessionData {
    cart?: { [key: string]: { productId: number; quantity: number } };
  }
}

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;

    if (!req.session.cart) {
      req.session.cart = {};
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const cartItem = req.session.cart[productId] || { productId, quantity: 0 };
    cartItem.quantity += quantity;

    if (cartItem.quantity <= 0) {
      delete req.session.cart[productId];
    } else {
      req.session.cart[productId] = cartItem;
    }

    res.json({
      success: true,
      cart: req.session.cart,
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Error adding to cart', 500);
  }
};

export const getCart = async (req: Request, res: Response) => {
  try {
    const cart = req.session.cart || {};
    const cartItems = [];
    let total = 0;

    for (const [productId, item] of Object.entries(cart)) {
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
      success: true,
      items: cartItems,
      total,
    });
  } catch (error) {
    throw new AppError('Error fetching cart', 500);
  }
};

export const clearCart = (req: Request, res: Response) => {
  req.session.cart = {};
  res.json({
    success: true,
    message: 'Cart cleared',
  });
};