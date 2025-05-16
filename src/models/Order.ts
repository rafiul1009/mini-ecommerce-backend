import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import OrderItem from './OrderItem';

interface OrderAttributes {
  id: number;
  userId: number;
  total: number;
}

class Order extends Model<OrderAttributes> implements OrderAttributes {
  public id!: number;
  public userId!: number;
  public total!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
  },
  {
    sequelize,
    modelName: 'Order',
    hooks: {
      afterCreate: async (order: Order) => {
        // Recalculate total after order items are added
        const items = await OrderItem.findAll({
          where: { orderId: order.id },
        });
        const total = items.reduce((sum, item) => sum + Number(item.get('quantity') * item.get('price')), 0);
        await order.update({ total });
      },
    },
  }
);

Order.belongsTo(User, { foreignKey: 'userId' });
Order.hasMany(OrderItem, { foreignKey: 'orderId' });

export default Order;