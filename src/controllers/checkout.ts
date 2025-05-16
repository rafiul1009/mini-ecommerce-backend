import { Request, Response } from 'express';
import { AppError } from '../middlewares/error';
import Order from '../models/Order';
import OrderItem from '../models/OrderItem';
import Product from '../models/Product';

export const checkout = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      throw new AppError('User ID is required', 400);
    }

    const cart = req.session.cart || {};
    if (Object.keys(cart).length === 0) {
      throw new AppError('Cart is empty', 400);
    }

    // Create order
    const order = await Order.create({
      userId,
      total: 0, // Will be calculated by Order model hook
    });

    // Create order items and check inventory
    const orderItems = [];
    for (const [productId, item] of Object.entries(cart)) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        throw new AppError(`Product with ID ${item.productId} not found`, 404);
      }

      // Create order item
      const orderItem = await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });

      orderItems.push(orderItem);
    }

    // Clear the cart after successful checkout
    req.session.cart = {};

    // Fetch the updated order with total
    const completedOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem }],
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: completedOrder,
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Error processing checkout', 500);
  }
};