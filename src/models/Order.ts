import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database.config';

interface OrderAttributes {
  id: number;
  userId: number;
  total: number;
}

// Mark `id` as optional for creation
interface OrderCreationAttributes extends Optional<OrderAttributes, 'id'> {}

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: number;
  public userId!: number;
  public total!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Override toJSON to return only dataValues
  public toJSON(): OrderAttributes {
    return this.get({ plain: true });
  }
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
      get() {
        const value = this.getDataValue('total');
    
        if (typeof value === 'number') {
          return value;
        }
    
        return value ? parseFloat(value as string) : null;
      }
    },
  },
  {
    sequelize,
    modelName: 'Order',
  }
);

export default Order;