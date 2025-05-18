import { Response } from 'express';
import { Transaction } from 'sequelize';
import sequelize from '../config/database.config';
import Order from '../models/Order';
import OrderItem from '../models/OrderItem';
import Product from '../models/Product';
import Category from '../models/Category';
import { AuthRequest } from '../middlewares/auth.middleware';

export const checkout = async (req: AuthRequest, res: Response) => {
  const transaction: Transaction = await sequelize.transaction();

  try {
    const { userId } = req.body;
    if (!userId) {
      res.status(400).json({ message: 'User ID is required' });
      return;
    }

    const cart = req.session.cart || {};
    if (Object.keys(cart).length === 0) {
      res.status(400).json({ message: 'Cart is empty' });
      return;
    }

    // Create order
    const order = await Order.create({
      userId,
      total: 0, // Will be calculated based on order items
    }, { transaction });

    let orderTotal = 0;
    // Create order items and check inventory
    for (const [productId, item] of Object.entries(cart)) {
      const product = await Product.findByPk(item.productId, { transaction });
      
      if (!product) {
        await transaction.rollback();
        res.status(404).json({ message: `Product with ID ${item.productId} not found` });
        return;
      }
      const category = await Category.findByPk(product.categoryId, { transaction });

      const itemTotal = product.price * item.quantity;
      orderTotal += itemTotal;

      // Create order item with product and category details
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        productName: product.name,
        productDescription: product.description || '',
        productPrice: product.price,
        categoryId: product.categoryId,
        categoryName: category?.name || '',
      }, { transaction });
    }

    // Update order total
    await order.update({ total: orderTotal }, { transaction });

    // Commit transaction
    await transaction.commit();

    // Clear the cart after successful checkout
    req.session.cart = {};

    // Fetch the completed order with items
    const completedOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem }]
    });

    res.status(201).json({
      message: 'Order created successfully',
      data: completedOrder
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error processing checkout:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};